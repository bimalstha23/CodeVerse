const io = require("socket.io")(8900, {
  cors: {
    origins: "*:*",
  },
});

const userSocketMap:any = {};

function getAllConnectedClients(roomId:string) {
  // Map
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
      (socketId:any) => {
          return {
              socketId,
              username: userSocketMap[socketId],
          };
      }
  );
}

const init =  (socket: any , io:any) => {
  // listen to chatMessage
  socket.on("chatMessage", ({msg , roomId}:{msg:string , roomId:string}) => {
    if(msg &&  roomId){
      socket.emit("chatMessage", msg);
      socket.in(roomId).emit("chatMessage", msg);
    }
  });

  socket.on("editor", ({code  , roomId}:{code:string , roomId:string}) => {
    if(code && roomId){
      socket.in(roomId).emit("editor", code);
    }
  });
  
  socket.on("language", ({language , roomId}:{language:string, roomId:string}) => {
    if(language && roomId){
      socket.in(roomId).emit("language", language);
    }
  });

  socket.on("cursor", ({cursor , roomId}:{cursor:any, roomId:string}) => {
    if(cursor && roomId){
      socket.in(roomId).emit("cursor", cursor);
    }
  });

  socket.on("input", ({input , roomId}:{input:string, roomId:string}) => {
    if(input && roomId){
      socket.in(roomId).emit("input", input);
    }
  });

  socket.on("output", ({output , roomId}:{output:string, roomId:string}) => {
    if(output && roomId){
      socket.in(roomId).emit("output", output);
    }
  });

  socket.on("code-Sync" , ({code , socketId}:{code:string, socketId:string}) => {
    io.to(socketId).emit('code-Sync', { code });
  });


  socket.on('joinroom', ({ roomId, username }:{
    roomId:string, username:string
  }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
        io.to(socketId).emit('Joined', {
            clients,
            username,
            socketId: socket.id,
        });
    });
});

  socket.on(
    "sending signal",
    (payload: { userToSignal: any; signal: any; callerID: any }) => {
      io.to(payload.userToSignal).emit("user joined", {
        signal: payload.signal,
        callerID: payload.callerID,
      });
    }
  );

  socket.on("returning signal", (payload: { callerID: any; signal: any }) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", ({roomId}:{roomId:string}) => {
        socket.in(roomId).emit('disconneted', {
            socketId: socket.id,
            username: userSocketMap[socket.id],
        });
    delete userSocketMap[socket.id];
    socket.leave();
  }); 

  // socket.on("joinroom", (roomId: string) => {
  //   socket.join(roomId);
  //   socket.broadcast.to(roomId).emit("userjoined");
  // });
  // socket.on("leaveroom", (roomId: string) => {
  //   socket.leave(roomId);
  // });

  // socket.on("join-room", (roomId: string, userId: string) => {
  //   socket.join(roomId);
  //   socket.broadcast.to(roomId).emit("user-connected", userId);

  //   socket.on("leaveAudioRoom", () => {
  //     socket.broadcast.to(roomId).emit("userLeftAudio", userId);
  //   });
  // });
};

export default init;