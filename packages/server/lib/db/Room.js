const dynamoose = require("dynamoose");

const Schema = dynamoose.Schema;

const schema = new Schema({
  id: {
    type: String,
    required: true,
    hashKey: true
  },
  created: Date,
  media: {
    type: "list",
    list: [
      {
        type: "map",
        map: {
          mediaId: String,
          url: String
        }
      }
    ]
  }
});

const Model = dynamoose.model("Room", schema);

module.exports = Model;
