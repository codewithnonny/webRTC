const socket = io("/");
const myPeer = new Peer(undefined, {
  host: "/",
  port: "3001",
});

//my stream
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;
const peers = {};

//stream
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);

    //peer call answer
    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    //user connection
    socket.on("user-connected", (userId) => {
      console.log("User Connected " + userId);
      connectToNewUser(userId, stream);
    });
  });

///user disconnected
socket.on("user-disconnected", (userId) => {
  if (peers[userId]) peers[userId].close();
});

//peer join
myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

//user connection method
function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
}

//video stream methods
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
