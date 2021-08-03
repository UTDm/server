import { v4 as uuidv4 } from 'uuid';

let users = [];
let room = {};

//async this function
const addUser = (userId, name, course) => {
    let newUser = { userId, name, course };

    if (newUser in users) throw Error("This user is already in the chat");

    if (room.course && room.course != '') {
        newUser = {...newUser, roomId: room.course};
        room.course = '';
    } else {
        let roomId = uuidv4();
        newUser = {...newUser, roomId};
        room.course = roomId;
    }

    users.push(newUser);
    return (newUser);
}

const removeUser = (id) => {
    users.map(user => { user.userId !== id });
}

const getRoomUserList = (roomId) => {
    users.filter(user => user.roomId !== roomId);
}

const getUser = (id) => {
    return (users.find(user => user.userId === id));
}

export { addUser, removeUser, getUser, getRoomUserList };