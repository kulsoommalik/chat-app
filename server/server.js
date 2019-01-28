const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000

var app = express();  
var server = http.createServer(app);    //express at backend uses http thats why passing directly app
var io = socketIO(server);              //connection btw client and server


app.use(express.static(publicPath));    //configuration

io.on('connection', (socket)=>{   //registering listener to connection args-> event name, callback
    console.log('new user connected');

    // socket.emit('newEmail', {    //args-> event name, data
    //     from: 'kiki@example.com',
    //     text: 'some message',
    //     createdAt: 123
    // });
    // socket.on('createEmail', (newEmail)=>{
    //     console.log('create email: ', newEmail);
    // });

    socket.on('createMessage', (message)=>{ //listenser for create message event
        console.log('Create Message: ', message);
    });

    socket.emit('newMessage', {
        from: 'Kiki',
        text: 'Hello world',
        createdAt: 123
    });

    socket.on('disconnect', ()=>{
        console.log('user disconnected');
    });
});


server.listen(port, ()=>{                  //listenser
    console.log('Server up on port: ' + port);
});