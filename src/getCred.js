var AWS = require("aws-sdk");
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";

export default {
  getCredentials() {
    return new Promise((resolve) => {
      let creds = {};
      let data = {
        UserPoolId: process.env.VUE_APP_COGNITO_USERPOOL_ID,
        ClientId: process.env.VUE_APP_COGNITO_CLIENT_ID,
      };
      let userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
      let cognitoUser = userPool.getCurrentUser();

      if (cognitoUser != null) {
        cognitoUser.getSession(function (err, session) {
          if (err) {
            console.log(err);
            return;
          }

          // console.log("session validity: " + session.isValid());
          // console.log(
          //   "session Identity token: " + session.getIdToken().getJwtToken()
          // );

          AWS.config.region = process.env.VUE_APP_AWS_REGION;

          let cognitoKey = process.env.VUE_APP_COGNITO_LOGIN_PROVIDER;
          let Login = {};
          Login[cognitoKey] = session.getIdToken().getJwtToken();

          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: process.env.VUE_APP_COGNITO_IDENTITY_POOL_ID,
            Logins: Login,
          });
          AWS.config.credentials.get(function (err) {
            if (!err) {
              let id = AWS.config.credentials.identityId;
              let key = AWS.config.credentials.accessKeyId;
              let secretkey = AWS.config.credentials.secretAccessKey;
              let sessionToken = AWS.config.credentials.sessionToken;
              // console.log("Cognito Identity ID " + id);
              // console.log("Cognito Key " + key);
              // console.log("Cognito Secret Key " + secretkey);
              // console.log("Cognito SessionToken " + sessionToken);
              creds.id = id;
              creds.key = key;
              creds.secretkey = secretkey;
              creds.sessionToken = sessionToken;
            }
          });
        });
      }
      resolve(creds);
    });
  },
};
