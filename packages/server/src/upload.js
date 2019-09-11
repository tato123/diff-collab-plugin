const express = require("express");
const router = express.Router();
const multer = require("multer");
const AWS = require("aws-sdk");
const Room = require("./db/Room");
const Media = require("./db/Media");
const MediaHistory = require("./db/MediaHistory");

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

const limits = {
  files: 1, // allow only 1 file per request
  fileSize: 209715200 // 200 MB (max file size)
};

const upload = multer({ storage: storage, limits }).single("image");

const getNextVersion = async id => {
  try {
    const media = await Media.get(id);

    return media.version + 1;
  } catch (err) {
    // creating a new object
    return 1;
  }
};

router.post("/:roomId/media", upload, async (req, res) => {
  try {
    console.log("----------------[upload media]-------------");
    console.log("[query]", req.query);
    const roomId = req.params.roomId;
    const guid = req.query.guid;

    console.log("RoomID: ", roomId);
    const item = req.file;
    const created = Date.now();

    const newFileName = `${roomId}/${item.originalname}`;

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
          // get the urls
          console.log("File successfully uploaded...", data);
          resolve({
            url: data.Location,
            versionId: data.VersionId,
            ...req.query
          });
        }
      });
    });

    const result = await uploadPromise;

    // get the current media for id
    const version = await getNextVersion(guid);

    // write a media history row
    await MediaHistory.create({
      id: guid,
      created,
      versionId: result.versionId,
      version
    });

    // creating a new version
    if (version === 1) {
      await Media.create({
        id: guid,
        roomId,
        created,
        version,
        ...result
      });
    }
    // otherwise update
    else {
      await Media.update({
        id: guid,
        roomId,
        created,
        version,
        ...result
      });
    }

    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(400).send("err");
  }
});

module.exports = router;
