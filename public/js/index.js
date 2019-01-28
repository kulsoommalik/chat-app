var socket = io();   //initiating request
socket.on('connect', function (){
    console.log('Connected to server');

    // socket.emit('createEmail', {
    //     to: 'blahblah@gamil.com',
    //     text:'something text'
    // });

});

socket.on('disconnect', function (){
    console.log('Disconnected from server');
});

//custom event
// socket.on('newEmail', function (email){  //listenser for email
//     console.log('Email: ', email);
// });
socket.on('newMessage', function (message){
    console.log('New Message: ', message);
});