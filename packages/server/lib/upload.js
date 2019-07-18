const express = require("express");
const router = express.Router();
const multer = require("multer");
const AWS = require("aws-sdk");

const storage = multer.memoryStorage({
  destination: function(req, file, callback) {
    callback(null, "");
  }
});
const multipleUpload = multer({ storage: storage }).array("image");
const upload = multer({ storage: storage }).single("image");

router.post("/:roomid/upload", multipleUpload, (req, res) => {
  console.log("Uploaded to room", req.params.roomid);
  const file = req.files;
  console.log(file);
  let s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
  const ResponseData = [];
  s3bucket.createBucket(() => {
    //file storing array for response

    console.log(process.env.AWS_BUCKET_NAME);
    file.map(item => {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: item.originalname,
        Body: item.buffer,
        ACL: "public-read"
      };
      s3bucket.upload(params, function(err, data) {
        if (err) {
          SentryErrorHandler(err);
        } else if (data) {
          console.log(data, "'im here'");

          //send res socket here
        }
      });
      console.log(ResponseData);
    });

    res.status(200).send();
  });
});

module.exports = router;
