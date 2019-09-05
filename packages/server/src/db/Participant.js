const dynamoose = require("dynamoose");

const Schema = dynamoose.Schema;

const schema = new Schema({
  roomSocket: {
    type: String,
    required: true,
    hashKey: true
  },
  user: String
});

const Model = dynamoose.model("Participant", schema);

module.exports = Model;
