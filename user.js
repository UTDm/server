let users = [];

const addUser = (userId, name, roomId) => {
    const newUser = { userId, name, roomId };

    if (newUser in users) throw Error("This user is already in the chat")

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