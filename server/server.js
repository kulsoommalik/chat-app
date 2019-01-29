const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000

var app = express();  
var server = http.createServer(app);    //express at backend uses http thats why passing directly app
var io = socketIO(server);              //connection btw client and server


app.use(express.static(publicPath));    //configuration

io.on('connection', (socket)=>{   //registering listener to connection args-> event name, callback
    console.log('new user connected');

    socket.emit('newMessage', generateMessage('admin', 'welcome to chat app'));
    //msg will will sent to everbody except itself
    socket.broadcast.emit('newMessage', generateMessage('admin', 'new user joined'));
    
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

    socket.on('disconnect', ()=>{
        console.log('user disconnected');
    });
});


server.listen(port, ()=>{                  //listenser
    console.log('Server up on port: ' + port);
});