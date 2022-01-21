import axios from "axios";
import auth from "./auth";

// const AWS_REGION = process.env.AWS_REGION;
// const VUE_APP_COGNITO_IDENTITY_POOL_ID = process.env.VUE_APP_COGNITO_IDENTITY_POOL_ID;
// const VUE_APP_COGNITO_LOGIN_PROVIDER = process.env.VUE_APP_COGNITO_LOGIN_PROVIDER;
var AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.VUE_APP_AWS_REGION,
});

export default {
  getUserInfo() {
    var jwtToken = auth.auth.getSignInUserSession().getAccessToken().jwtToken;
    const USERINFO_URL =
      "https://" + auth.auth.getAppWebDomain() + "/oauth2/userInfo";
    var requestData = {
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
    };
    var IDToken = auth.auth.getSignInUserSession().getIdToken().jwtToken;

    let cognitoKey = process.env.VUE_APP_COGNITO_LOGIN_PROVIDER;
    let Login = {};
    Login[cognitoKey] = IDToken;

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: process.env.VUE_APP_COGNITO_IDENTITY_POOL_ID,
      Logins: Login,
    });

    return axios.get(USERINFO_URL, requestData).then((response) => {
      return response.data;
    });
  },
};
