const dynamoose = require("dynamoose");

const Schema = dynamoose.Schema;

const schema = new Schema({
  id: {
    type: String,
    required: true,
    hashKey: true
  },
  created: Date
});

const Model = dynamoose.model("Room", schema);

module.exports = Model;
