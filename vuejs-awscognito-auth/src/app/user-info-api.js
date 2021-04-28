import axios from 'axios';
import auth from './auth';

var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-1",
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
        // Configure the credentials provider to use your identity pool
        // AWS.config.region = 'ca-central-1'; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: "us-east-1:4331c2aa-4a72-49f5-87e8-e61d554b5435",
            //  'us-east-1:4331c2aa-4a72-49f5-87e8-e61d554b5435',
            Logins: { // optional tokens, used for authenticated login
                // "IdentityId": IdentityId,
                'cognito-idp.us-east-1.amazonaws.com/us-east-1_2Zz9kQADV': IDToken
            }
        });
        // Make the call to obtain credentials
        AWS.config.credentials.get(function () {

            // Credentials will be available when this function is called.
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