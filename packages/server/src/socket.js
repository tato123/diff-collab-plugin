const jwt = require("jsonwebtoken");
const Participant = require("./db/Participant");
const RoomSync = require("./db/RoomSync");

const synced = {};

const toParticipantKey = (room, socketId) => {
  return room + ";" + socketId;
};

const toRoomSyncKey = (room, dataId) => {
  return room + ";" + dataId;
};

const addParticipant = async (room, socketId, user) => {
  try {
    const partcipant = new Participant({
      roomSocket: toParticipantKey(room, socketId),
      created: Date.now(),
      user: JSON.stringify(Object.assign({}, user, { socketId, room }))
    });

    await partcipant.save();
  } catch (error) {
    console.error("Unable to save", error);
  }
};

const getParticipants = async room => {
  try {
    const results = await Participant.scan({
      roomSocket: { contains: room }
    }).exec();
    const participants = results.map(r => JSON.parse(r.user));
    console.log("Results of get partcipants", participants);
    return participants;
  } catch (err) {
    console.error("Error fetching participants", err);
  }
};

const deleteParticipant = async (room, socketId) => {
  try {
    await Participant.delete({ roomSocket: toParticipantKey(room, socketId) });
  } catch (err) {
    console.error("Error removing partcipant", err);
  }
};

const createRoomSync = async (room, data) => {
  try {
    const sync = new RoomSync({
      roomData: toRoomSyncKey(room, data.o.id),
      created: Date.now(),
      data: JSON.stringify(data)
    });

    await sync.save();
  } catch (error) {
    console.error("Unable to create RoomSync", error);
  }
};

const getRoomSync = async room => {
  try {
    const results = await RoomSync.scan({
      roomData: { contains: room }
    }).exec();
    const syncs = results.map(r => JSON.parse(r.data));
    console.log("Results of get syncs", syncs);
    return syncs;
  } catch (err) {
    console.error("Error fetching room sync", err);
  }
};

module.exports = io => {
  const dynamicNsp = io
    .of(/^\/room-.*$/)
    .use((socket, next) => {
      if (socket.handshake.query && socket.handshake.query.token) {
        // @todo: perform a check on whether it is using
        // a guest account or regular account

        const token = socket.handshake.query.token;
        const decoded = jwt.verify(token, "shhhhh");
        socket.decoded = decoded;
        next();
      } else {
        next(new Error("Authentication error"));
      }
    })

    .on("connect", async socket => {
      console.log("[connect] token is", socket.decoded);
      const user = socket.decoded;
      const newNamespace = socket.nsp;

      const room = newNamespace.name.match(/^\/room-(.*)/)[1];

      console.log("namespace is ", room, user.email);

      await addParticipant(room, socket.id, user);

      socket.broadcast.emit("participants", await getParticipants(room));

      console.log("connection received", socket.id);

      // user is doing something
      socket.on("activity", data => {
        // console.log("Sending data", data);
        socket.broadcast.emit("activity", data);
      });

      // user is requesting our participants
      socket.on("get:participants", async () => {
        socket.emit("participants", await getParticipants(room));
      });

      // get all the synced activities
      socket.on("get:synced", async () => {
        // emit whatever was synced
        socket.emit("synced", await getRoomSync(room));
      });

      // persist the data before re-broadcasting
      // each message should have an id
      socket.on("sync:activity", async data => {
        await createRoomSync(room, data);

        // broadcast out as a plain activity
        socket.broadcast.emit("activity", data);
      });

      //
      socket.on("disconnect", async () => {
        await deleteParticipant(room, socket.id);
        socket.broadcast.emit("participants", await getParticipants(room));
        console.log("disconnection occured", socket.id);
      });
    });
};
