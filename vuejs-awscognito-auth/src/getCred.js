var data = {
    UserPoolId: "us-east-1_2Zz9kQADV",
    ClientId: "6jat7qqkiduf90s2rtj60q4689",
  };
  var userPool = new cognito.CognitoUserPool(data);
  var cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
    cognitoUser.getSession(function(err, session) {
      if (err) {
        console.log(err);
        return;
      }
  
      console.log('session validity: ' + session.isValid());
      console.log('session Identity token: ' + session.getIdToken().getJwtToken());
  
      AWS.config.region = "us-east-1";
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId : "us-east-1:4331c2aa-4a72-49f5-87e8-e61d554b5435", 
        Logins : {
          // Change the key below according to the specific region your user pool is in.
          'cognito-idp.us-east-2.amazonaws.com/1_2Zz9kQADV': session.getIdToken().getJwtToken()
        }
      });
  
      AWS.config.credentials.get(function(err,data) {
        if (!err) {
          var id = AWS.config.credentials.identityId;
          var key = AWS.config.credentials.accessKeyId;
          var secretkey = AWS.config.credentials.secretAccessKey;
          var sessionToken = AWS.config.credentials.sessionToken;
          console.log('Cognito Identity ID '+ id);
          console.log('Cognito Key '+ key);
          console.log('Cognito Secret Key '+ secretkey);
          console.log('Cognito SessionToken '+ sessionToken);
        }
      });
    });
  }