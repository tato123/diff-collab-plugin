const jwt = require("jsonwebtoken");

const participants = {};

const synced = {};

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

    .on("connect", socket => {
      console.log("[connect] token is", socket.decoded);
      const user = socket.decoded;
      const newNamespace = socket.nsp;

      const room = newNamespace.name.match(/^\/room-(.*)/)[1];

      console.log("namespace is ", room, user.email);

      if (!participants[room]) {
        participants[room] = {};
      }

      participants[room][socket.id] = Object.assign({}, user, {
        id: socket.id
      });

      socket.broadcast.emit("participants", participants[room]);

      console.log("connection received", socket.id);

      // user is doing something
      socket.on("activity", data => {
        // console.log("Sending data", data);
        socket.broadcast.emit("activity", data);
      });

      // user is requesting our participants
      socket.on("get:participants", () => {
        socket.emit("participants", participants[room]);
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
      socket.on("disconnect", () => {
        const obj = participants[room];
        delete obj[socket.id];
        socket.broadcast.emit("participants", participants[room]);
        console.log("disconnection occured", socket.id);
      });
    });
};
