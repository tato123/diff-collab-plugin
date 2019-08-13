const express = require("express");
const router = express.Router();
const multer = require("multer");
const AWS = require("aws-sdk");
const short = require("short-uuid");
const Room = require("./db/Room");
const Media = require("./db/Media");

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const storage = multer.memoryStorage({
  destination: function(req, file, callback) {
    callback(null, "");
  }
});

const multipleUpload = multer({ storage: storage }).array("image");

const limits = {
  files: 1, // allow only 1 file per request
  fileSize: 209715200 // 200 MB (max file size)
};

const upload = multer({ storage: storage, limits }).single("image");

router.post("/:roomId/media", upload, async (req, res) => {
  try {
    console.log("----------------[upload media]-------------");
    console.log("[query]", req.query);
    const roomId = req.params.roomId;
    console.log("RoomID: ", roomId);
    const item = req.file;
    const created = Date.now();

    // generate a short name
    const mediaId = short.generate();
    const newFileName = `${mediaId}-${item.originalname}`;

    // upload a file
    const params = {
      Bucket: BUCKET_NAME,
      Key: newFileName,
      Body: item.buffer,
      ACL: "public-read"
    };

    const uploadPromise = new Promise((resolve, reject) => {
      S3.upload(params, (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        } else if (data) {
          const fileURL = `https://s3.amazonaws.com/${BUCKET_NAME}/${newFileName}`;
          // get the urls
          console.log("File successfully uploaded...", fileURL);
          resolve({
            mediaId: mediaId,
            url: fileURL,
            ...req.query
          });
        }
      });
    });

    const result = await uploadPromise;

    Media.create(
      { roomId: roomId, created: created, id: mediaId, ...result },
      err => {
        if (err) {
          console.error("An error occured updating room", err);
          res.status(400).send(err);
        } else {
          console.log("Succesfully updated room");
          res.status(200).send();
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(400).send("err");
  }
});

router.post("/:roomId/upload", multipleUpload, async (req, res) => {
  try {
    console.log("----------------[upload media]-------------");
    const roomId = req.params.roomId;
    console.log("RoomID: ", roomId);
    const file = req.files;
    console.log("Files: ", file.length);
    const ResponseData = [];

    const promises = file.map(item => {
      // generate a short name
      const mediaId = short.generate();
      const newFileName = `${mediaId}-${item.originalname}`;

      // upload a file
      const params = {
        Bucket: BUCKET_NAME,
        Key: newFileName,
        Body: item.buffer,
        ACL: "public-read"
      };

      return new Promise((resolve, reject) => {
        S3.upload(params, (err, data) => {
          if (err) {
            console.error(err);
            reject(err);
          } else if (data) {
            const fileURL = `https://s3.amazonaws.com/${BUCKET_NAME}/${newFileName}`;
            // get the urls
            console.log("File successfully uploaded...", fileURL);
            resolve({
              mediaId: mediaId,
              url: fileURL
            });
          }
        });
      });
    });

    const media = await Promise.all(promises);
    Room.update({ id: roomId }, { media }, err => {
      if (err) {
        console.error("An error occured updating room", err);
        res.status(400).send(err);
      } else {
        console.log("Succesfully updated room");
        res.status(200).send();
      }
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
