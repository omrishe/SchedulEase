const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

async function getSecretParm(name) {
  const client = new SSMClient({ region: "eu-central-1" });
  const command = new GetParameterCommand({ Name: name, WithDecryption: true });
  const res = await client.send(command);
  return res.Parameter.Value;
}

module.exports = { getSecretParm };
