import axios from 'axios';
import auth from './auth';

// const AWS_REGION = process.env.AWS_REGION;
// const VUE_APP_COGNITO_IDENTITY_POOL_ID = process.env.VUE_APP_COGNITO_IDENTITY_POOL_ID;
// const VUE_APP_COGNITO_LOGIN_PROVIDER = process.env.VUE_APP_COGNITO_LOGIN_PROVIDER;
var AWS = require("aws-sdk");
AWS.config.update({
    region: 'us-east-1',
});

export default {
    getUserInfo() {
        var jwtToken = auth.auth.getSignInUserSession().getAccessToken().jwtToken;
        const USERINFO_URL = 'https://' + auth.auth.getAppWebDomain() + '/oauth2/userInfo';
        var requestData = {
            headers: {
                'Authorization': 'Bearer ' + jwtToken
            }
        }
        var IDToken = auth.auth.getSignInUserSession().getIdToken().jwtToken
        console.log("ID Token", IDToken)
        
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-1:4331c2aa-4a72-49f5-87e8-e61d554b5435',
            Logins: { 
                'cognito-idp.us-east-1.amazonaws.com/us-east-1_2Zz9kQADV' : IDToken
            }
        });

        AWS.config.credentials.get(function () {
            var accessKeyId = AWS.config.credentials.accessKeyId;
            var secretAccessKey = AWS.config.credentials.secretAccessKey;
            var sessionToken = AWS.config.credentials.sessionToken;
            console.log(accessKeyId)
            console.log(secretAccessKey)
            console.log(sessionToken)
        });
        return axios.get(USERINFO_URL, requestData).then(response => {
            return response.data;
        });
    }
}