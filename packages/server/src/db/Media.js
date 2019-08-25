const dynamoose = require("dynamoose");

const Schema = dynamoose.Schema;

const schema = new Schema({
  id: {
    type: String,
    required: true,
    hashKey: true
  },
  created: Date,
  roomId: String,
  url: String,
  guid: String,
  version: Number,
  x: String,
  y: String,
  w: String,
  h: String
});

const Model = dynamoose.model("Media", schema);

module.exports = Model;
