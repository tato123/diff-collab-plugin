const dynamoose = require("dynamoose");

const createDynamooseInstance = () => {
  dynamoose.AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("Connecting to a local dynamo instance");
    dynamoose.local();
  }
};

module.exports = async () => {
  createDynamooseInstance();
};
