const participants = {};

module.exports = io => {
  const dynamicNsp = io.of(/^\/room-.*$/).on("connect", socket => {
    const newNamespace = socket.nsp;
    participants[socket.id] = true;
    socket.broadcast.emit("participants", participants);

    console.log("connection received", socket.id);
    socket.on("activity", data => {
      console.log("Sending data", data);
      socket.broadcast.emit("activity", data);
    });

    socket.on("get:participants", () => {
      socket.emit("participants", participants);
    });

    socket.on("disconnect", () => {
      delete participants[socket.id];
      socket.broadcast.emit("participants", participants);
      console.log("disconnection occured", socket.id);
    });
  });
};
