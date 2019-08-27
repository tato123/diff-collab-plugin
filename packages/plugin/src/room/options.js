const Axios = require("axios");
const getUserOptions = require("./dialog");

const fetchRoomId = async () => {
  const res = await Axios.get(`${process.env.API_SERVER}/room/id`);
  const roomId = res.data;
  return roomId;
};

const isValidRoomId = async roomId => {
  try {
    const res = await Axios.get(`${process.env.API_SERVER}/room/${roomId}`);
    console.log("response is", res);
    return true;
  } catch (err) {
    return false;
  }
};

const getPluginDataValue = async (documentRoot, key) => {
  let value;

  // try to fetch a room id
  if (documentRoot.pluginData) {
    const val = JSON.parse(documentRoot.pluginData);
    value = val[key] || null;
  }

  if (value && !(await isValidRoomId(value))) {
    console.warn("RoomId does not exist", value);
    return [null, "not-exist"];
  }

  return [value];
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
  let [roomId, reason] = await getPluginDataValue(documentRoot, "roomId");

  // if not we need to give the user the option to select
  // a project to upload to or set a roomid
  const options = await getUserOptions(roomId, reason);

  // user would like us to cancel
  if (options.which === 0) {
    return { roomId: null, didCancel: true };
  }

  const { share_settings } = options.value;
  console.log("user selected", share_settings);

  // attempt to use the existing room that does exist
  if (share_settings === "existing" && roomId) {
    console.log("Reusing existing roomid", roomId);
    return { roomId };
  }

  // create a new one
  console.log("Generating a new roomId, user selected:", share_settings);
  roomId = await fetchRoomId();
  storePluginDataValue(documentRoot, "roomId", roomId);
  console.log("New roomid", roomId);

  return { roomId, didCancel: false };
};

module.exports = getRoomId;
