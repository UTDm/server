let users = [];

async function addUser(userId, name, roomId) {
    const newUser = {userId, name, roomId};

    users.push(newUser);

    return newUser;
} 

async function removeUser(id) {
    users.map(user => {user.userId !== id});
}

async function getRoomUserList(roomId) {
    users.filter(user => user.roomId !== roomId);
}

async function getUser(id) {
    return users.find(user => user.userId === id)
}
