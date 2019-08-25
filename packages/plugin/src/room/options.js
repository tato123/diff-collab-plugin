const Axios = require("axios");
const getUserOptions = require("./dialog");

const fetchRoomId = async () => {
  const res = await Axios.get(`${process.env.API_SERVER}/room/id`);
  const roomId = res.data;
  return roomId;
};

const getPluginDataValue = (documentRoot, key) => {
  let value;

  // try to fetch a room id
  if (documentRoot.pluginData) {
    const val = JSON.parse(documentRoot.pluginData);
    value = val[key] || null;
  }

  return value;
};

const storePluginDataValue = (documentRoot, key, value) => {
  const val = documentRoot.pluginData
    ? JSON.parse(documentRoot.pluginData)
    : {};
  const newVal = {
    ...val,
    [key]: value
  };
  documentRoot.pluginData = JSON.stringify(newVal);
};

const getRoomId = async documentRoot => {
  let roomId = getPluginDataValue(documentRoot, "roomId");

  // if not we need to give the user the option to select
  // a project to upload to or set a roomid
  const options = await getUserOptions(roomId);
  const { share_settings } = options.value;
  console.log("user selected", share_settings);

  if (share_settings === "existing" && roomId) {
    console.log("Reusing existing roomid", roomId);
    return { roomId };
  }

  // create a new one
  console.log("Generating a new roomId, user selected:", share_settings);
  roomId = await fetchRoomId();
  storePluginDataValue(documentRoot, "roomId", roomId);
  console.log("New roomid", roomId);

  return { roomId };
};

module.exports = getRoomId;
