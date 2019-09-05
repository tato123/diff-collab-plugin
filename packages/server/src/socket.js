const jwt = require("jsonwebtoken");
const Participant = require("./db/Participant");

const participants = {};

const synced = {};

const toParticipantKey = (room, socketId) => {
  return room + ";" + socketId;
};

const addParticipant = async (room, socketId, user) => {
  try {
    const partcipant = new Participant({
      roomSocket: toParticipantKey(room, socketId),
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
      socket.on("get:synced", () => {
        // emit whatever was synced
        socket.emit("synced", synced[room]);
      });

      // persist the data before re-broadcasting
      // each message should have an id
      socket.on("sync:activity", data => {
        if (!synced[room]) {
          synced[room] = {};
        }

        console.log("Syncing activity", data);

        // naive algorithm for storage
        // assumes that it's a one way write, last one in wins
        synced[room][data.o.id] = data;

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
