const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const router = require('./router');
const { addUser, removeUser, getUsersInRoom } = require('./users');

const randomId = () => crypto.randomBytes(8).toString("hex");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connect', (socket) => {
    
    socket.on('join', ({name, roomId}, callBack) => {
        socket.userId = randomId();
        socket.userName = name;
        socket.roomId = roomId;

        const user = await addUser(socket.userId, name, roomId);
        const userList = await getRoomUserList(roomId);

        socket.join(room);
        io.to(user.roomId).emit('getUserList', {roomId: roomId, users: userList});
        io.to(user.roomId).emit('newMessage', {
            message: `${user.name} has joined the room`,
            from: "admin",
        });

        callBack(user);
    });

    socket.on("sendMessage", (message) => {
        const user = getUser(socket.userId);

        io.to(socket.roomId).emit("newMessage", {
            message,
            from: user.userID,
        });
    });

    socket.on('disconnect', () => {
        
        const user = await getUser(socket.userId);
        await removeUser(user.userId);
        const userList = await getRoomUserList(roomId);
    
        if(user) {
            io.to(user.roomId).emit('newMessage', {
                message: `${user.name} has left the room`,
                from: "admin",
            });
            io.to(user.roomId).emit('getUserList', {roomId: roomId, users: userList});
        }
    })

});


server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));