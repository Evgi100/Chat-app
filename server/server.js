const express = require('express');

const port=process.env.PORT || 3000;
const app = express();

const path = require('path');

const http = require('http')

const socketIO = require('socket.io');

const { isRealString } = require('./utils/validation')
const { Users } = require('./utils/users')
const { generateMessage, generateLocationMessage } = require('./utils/message')

const publicPath = path.join(__dirname, '../public')

var server = http.createServer(app);

var io = socketIO(server)
var users = new Users()

app.use(express.static(publicPath))
// __dirname stores the path to our project directory

io.on('connection', (socket) => {
    console.log('New user connected');


    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and Room are required')
        }
        socket.join(params.room);
        // users.removeUser(socket.id);
        if (!users.getUser(socket.id)) {

            users.addUser(socket.id, params.name, params.room);
            io.to(params.room).emit('updateUserList', users.getUserList(params.room,params.name))
            socket.emit('welcomeMessage', generateMessage('Admin', `${params.name} Welcome to the chat app`));
            socket.broadcast.to(params.room).emit('newUser', generateMessage('Admin', `${params.name} has joined`))
            callback();
        }

    })
    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text))
        }
        callback();
    })

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
        }
    })


    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room,user.name))
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
    });
});



server.listen(port, () => {
    console.log('Yo Yo on 3000');
})


