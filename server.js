const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;



http.listen(PORT, () => {
    console.log("memo'nun server port" + " " + PORT)
});


//SOCKET.IO

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.use(express.static('public'));



io.on('connection', (socket) => {
    console.log("yeni client is connected socket.id=" + " " + socket.id)

    socket.on('userMessage', (data) => {
        io.sockets.emit("userMessage", data)
    })
        

      // send typing Message  
    socket.on('userTyping', (data) => {
            socket.broadcast.emit('userTyping',data)
        });
    });



