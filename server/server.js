const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000

var app = express();  
var server = http.createServer(app);    //express at backend uses http thats why passing directly app
var io = socketIO(server);              //connection btw client and server
//user instance
var users = new Users();

app.use(express.static(publicPath));    //configuration

io.on('connection', (socket)=>{   //registering listener to connection args-> event name, callback
    console.log('new user connected');
    //join button params
    socket.on('join', (params, callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('room name and name required');
        }
        socket.join(params.room); //joining people in same room 
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room); //adding user to list
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage('admin', 'welcome to chat app'));
        //msg will will sent to everbody except itself
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('admin', `${params.name} has joined`));
        callback();
    });

    //listenser createMessage
    socket.on('createMessage', (message, callback)=>{ //listenser for create message event
        console.log('Create Message: ', message);
        //io.emit emits to every single connection while socket.emit emits to only one connection
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude ,coords.longitude));
    });

    //disconnect
    socket.on('disconnect', ()=>{
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
    });
});


server.listen(port, ()=>{                  //listenser
    console.log('Server up on port: ' + port);
});