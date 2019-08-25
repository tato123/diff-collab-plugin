const dynamoose = require("dynamoose");

const Schema = dynamoose.Schema;

const schema = new Schema({
  id: {
    type: String,
    required: true,
    hashKey: true
  },
  created: Date,
  creator: {
    type: String,
    default: ""
  },
  roomId: String,
  url: String,
  version: Number,
  versionId: String,
  x: String,
  y: String,
  w: String,
  h: String
});

const Model = dynamoose.model("Media", schema);

module.exports = Model;
