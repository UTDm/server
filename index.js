import { createServer } from 'http';
import express from 'express';
import { Server } from "socket.io";
import cors from 'cors';

import router from './router.js';
import { addUser, removeUser, getRoomUserList, getUser} from './user.js';

const randomId = () => crypto.randomBytes(8).toString("hex");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors());
app.use(router);

io.on('connect', (socket) => {
    socket.on('join', ({name, roomId}) => {
        let userId = socket.id;

        //TODO: catch error
        const user = addUser(userId, name, roomId);
        const userList = getRoomUserList(roomId);

        socket.join(roomId);
        io.to(user.roomId).emit('getUserList', {users: userList});
        io.to(user.roomId).emit('newMessage', {
            context: name + " has joined the room",
            from: "admin",
        });
    });

    socket.on("sendMessage", (context) => {
        const user = getUser(socket.id);

        io.to(user.roomId).emit("newMessage", {
            context,
            from: socket.id,
        });
    });

    socket.on('disconnected', () => {
        //TODO: remove current user
        const user = getUser(socket.id);
        removeUser(user.userId);
        const userList = getRoomUserList(user.roomId);
    
        if(user) {
            io.to(user.roomId).emit('newMessage', {
                context: `${user.name} has left the room`,
                from: "admin",
            });
            io.to(user.roomId).emit('getUserList', {roomId: user.roomId, users: userList});
        }

        console.log(`${socket.id} has disconneted from room ${user.roomId}`)
    })

});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));