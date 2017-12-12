function (user, context, callback) {

  var mfa_enabled_connection = [
    'github',
    'google-oauth2'
  ].indexOf(context.connection) !== -1;

  var user_with_mfa = user.app_metadata && user.app_metadata.use_mfa;

  if (
    user_with_mfa &&
    mfa_enabled_connection
  ) {

    context.multifactor = {
      provider: 'google-authenticator',

      // optional, the label shown in the authenticator app
      issuer: 'MOJ Analytical Platform (dev)',

      // optional, the key to use for TOTP. By default one is generated for you
      // key: '{YOUR_KEY_HERE}',

      // optional, defaults to true. false forces 2FA every time.
      allowRememberBrowser: false
    };
  }

  callback(null, user, context);
}
