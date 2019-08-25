const dynamoose = require("dynamoose");

const Schema = dynamoose.Schema;

const schema = new Schema({
  id: {
    type: String,
    required: true,
    hashKey: true
  },
  version: {
    type: Number,
    rangeKey: true,
    index: true
  },
  creator: {
    type: String,
    default: ""
  },
  created: Date,
  versionId: String
});

const Model = dynamoose.model("MediaHistory", schema);

module.exports = Model;
