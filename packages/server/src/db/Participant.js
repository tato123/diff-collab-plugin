const dynamoose = require("dynamoose");

const Schema = dynamoose.Schema;

const schema = new Schema({
  roomSocket: {
    type: String,
    required: true,
    hashKey: true
  },
  created: Date,
  user: String
});

const Model = dynamoose.model("Participant", schema);

module.exports = Model;
