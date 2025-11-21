const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

async function test() {
  const client = new SSMClient({ region: "eu-central-1" });
  try {
    const command = new GetParameterCommand({
      Name: "/schedulease/mongo-uri",
      WithDecryption: true,
    });
    const res = await client.send(command);
    console.log("Parameter value:", res.Parameter.Value);
  } catch (err) {
    console.error("Error fetching parameter:", err);
  }
}

test();
