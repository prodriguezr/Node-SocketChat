// const { Socket } = require('socket.io');  
const { testJWT } = require('../../helpers');
const { ChatMessages } = require('../../models');

const chatMessages = new ChatMessages();

const socketController = async(socket, io) => {
    const user = await testJWT(socket.handshake.headers['x-keyapp']);
    
    if (!user) {
        socket.disconnect();
    }
    
    chatMessages.connectUser(user);
    
    io.emit('active-users', chatMessages.usersArray);
    socket.emit('receive-messages', chatMessages.last10);

    socket.join(user.id);
    
    socket.on('disconnect', () => {
        chatMessages.disconnectUser(user.id);
        io.emit('active-users', chatMessages.usersArray);
    });
    
    socket.on('send-message', ({uid, message}) => {
        chatMessages.sendMessage(user.id, user.name, message);
        
        if (uid) {
            // Private Message
            socket.to(uid).emit('private-message', { from: user.name, message })
        } else {
            io.emit('receive-messages', chatMessages.last10);
        }
    });
}

module.exports = {
    socketController
}