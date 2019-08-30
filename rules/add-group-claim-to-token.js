function (user, context, callback) {

  var targeted_clients = [
    'br2x64Dyp3G791evEcpaNSsgoAYJ7dzp'
  ].indexOf(context.clientID) !== -1;

  var github_identity = _.find(user.identities, {connection: 'github'});

  if (github_identity && targeted_clients) {
    // For custom claims, you must define a namespace for oidc compliance.
    // See https://auth0.com/docs/api-auth/tutorials/adoption/scope-custom-claims
    var namespace = 'https://api.analytical-platform.service.justice.gov.uk/claims/';
    var options = {
      url: 'https://api.github.com/user/teams',
      headers: {
        'Authorization': 'token ' + github_identity.access_token,
        'User-Agent': 'request'
      }
    };

    var request = require('request');
    request(options, function (error, response, body) {
      if (response.statusCode !== 200) {
        return callback(new Error('Error retrieving teams from github: ' + body || error));

      } else {
        var github_orgs = [
          "ministryofjustice",
          "moj-analytical-services",
        ];
        var git_teams = JSON.parse(body).map(function (team) {
          if (github_orgs.includes(team.organization.login)) {
            // TODO: namespace slugs by org
            return team.slug;
          }
        });

        // Add the namespaced claims to ID token
        context.idToken[namespace + "groups"] = git_teams;
      }

      return callback(null, user, context);
    });
  } else {
    return callback(null, user, context);
  }
}
