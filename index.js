import { createServer } from 'http';
import express from 'express';
import { Server } from "socket.io";
import cors from 'cors';

import router from './router.js';
import { addUser, removeUser, getRoomUserList, getUser} from './user.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors());
app.use(router);

io.on('connect', (socket) => {
    socket.on('join', ({name, userId, roomId}) => {
        //TODO: catch error
        const user = addUser(userId, name, roomId);

        if (user) {
            const userList = getRoomUserList(roomId);

            socket.join(roomId);
            io.to(user.roomId).emit('getUserList', { users: userList });
            io.to(user.roomId).emit('newMessage', {
                context: name + " has joined the room",
                from: "admin",
            });
        }
    });

    socket.on("sendMessage", ({context, from}) => {
        const user = getUser(from);

        io.to(user.roomId).emit("newMessage", {
            context,
            from: from,
        });
    });

    socket.on('disconnected', (userId) => {
        //TODO: remove current user
        console.log(`${userId} has disconnected`)
        const user = getUser(userId);
        removeUser(userId);
    
        if(user) {
            const userList = getRoomUserList(user.roomId);

            io.to(user.roomId).emit('newMessage', {
                context: `${user.name} has left the room`,
                from: "admin",
            });
            io.to(user.roomId).emit('getUserList', {roomId: user.roomId, users: userList});
        }

        //console.log(`${userId} has disconneted from room ${user.roomId}`)
    })

});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));