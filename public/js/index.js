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
//listenser to location msg
socket.on('newLocationMessage', function(message){
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank"> My Current location <a/>');

    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
  
});

//acknowlegment of event from client
// socket.emit('createMessage', {

//     from: 'mike',
//     text: 'its from index.js'
// }, function (data){
//     console.log('got it ', data);
// });

//============ msg work============
var messageTextbox = jQuery('[name=message]');
jQuery('#message-form').on('submit', function (e){
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'user',
        text: messageTextbox.val()
    }, function(){
        messageTextbox.val('');
    });

});

//============geolocation work============

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  //disable button after click
  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    //enable send button
    locationButton.removeAttr('disabled').text('Send location');
    
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});
