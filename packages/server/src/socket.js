const rug = require("random-username-generator");

const participants = {};

const synced = {};

module.exports = io => {
  const dynamicNsp = io.of(/^\/room-.*$/).on("connect", socket => {
    const newNamespace = socket.nsp;

    const room = newNamespace.name.match(/^\/room-(.*)/)[1];
    const new_username = rug.generate();

    console.log("namespace is ", room, new_username);

    if (!participants[room]) {
      participants[room] = {};
    }

    participants[room][socket.id] = {
      name: new_username,
      id: socket.id
    };

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
