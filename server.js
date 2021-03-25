const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

//import routes
const userRoute = require("./routes/room");

//middleware

app.set("view engine", "ejs");
app.use(express.static("public"));

//routes middleware
app.use(userRoute);

///socket
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId);
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

//port
port = process.env.PORT || 3000;

//listening port
server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
