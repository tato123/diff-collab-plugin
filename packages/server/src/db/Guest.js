const dynamoose = require("dynamoose");

const Schema = dynamoose.Schema;

const schema = new Schema({
  id: {
    type: String,
    required: true,
    hashKey: true
  },
  email: {
    type: String,
    required: true,
    index: {
      global: true,
      rangeKey: "id",
      name: "EmailIndex",
      project: true,
      throughput: 3
    }
  },
  created: Date
});

const Model = dynamoose.model("Guest", schema);

module.exports = Model;
