const KeyVault = require("azure-keyvault");
const AuthenticationContext = require("adal-node").AuthenticationContext;

const clientId = "a579b2f2-f966-4611-92cd-8afe4b1f8960";
const clientSecret = "rsxaidwF9fINEk5P8QzXRfNCuuCJPnBIB4QJ2q7FF88=";

async function auth() {
  // Setup key vault client and credentials
  const authenticator = function(challenge, callback) {
    const context = new AuthenticationContext(challenge.authorization);
    return context.acquireTokenWithClientCredentials(
      challenge.resource,
      clientId,
      clientSecret,
      function(err, tokenResponse) {
        if (err) throw err;
        const authorizationValue =
          tokenResponse.tokenType + " " + tokenResponse.accessToken;
        return callback(null, authorizationValue);
      }
    );
  };
  const credentials = await new KeyVault.KeyVaultCredentials(authenticator);
  const client = await new KeyVault.KeyVaultClient(credentials);

  return client;
}

module.exports = auth;
