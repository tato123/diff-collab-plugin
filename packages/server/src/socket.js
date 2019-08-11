const rug = require("random-username-generator");

const participants = {};

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
    socket.on("activity", data => {
      console.log("Sending data", data);
      socket.broadcast.emit("activity", data);
    });

    socket.on("get:participants", () => {
      socket.emit("participants", participants[room]);
    });

    socket.on("disconnect", () => {
      const obj = participants[room];
      delete obj[socket.id];
      socket.broadcast.emit("participants", participants[room]);
      console.log("disconnection occured", socket.id);
    });
  });
};
