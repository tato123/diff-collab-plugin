module.exports = io => {
  const dynamicNsp = io.of(/^\/room-\d+$/).on("connect", socket => {
    const newNamespace = socket.nsp;

    console.log("connection received", socket.id);
    socket.on("mousemove", data => {
      console.log("Sending data", data);
      socket.broadcast.emit("mousemove", data);
    });

    socket.on("disconnect", () => {
      console.log("disconnection occured", socket.id);
    });
  });
};
