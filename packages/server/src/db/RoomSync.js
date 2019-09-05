const dynamoose = require("dynamoose");

const Schema = dynamoose.Schema;

const schema = new Schema({
  roomData: {
    type: String,
    required: true,
    hashKey: true
  },
  created: Date,
  data: String
});

const Model = dynamoose.model("RoomSync", schema);

module.exports = Model;
