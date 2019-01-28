var socket = io();   //initiating request

socket.on('connect', function (){
    console.log('Connected to server');
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
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
});

//acknowlegment of event from client
// socket.emit('createMessage', {

//     from: 'mike',
//     text: 'its from index.js'
// }, function (data){
//     console.log('got it ', data);
// });

jQuery('#message-form').on('submit', function (e){
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'user',
        text: jQuery('[name=message]').val()
    }, function(){

    });
});