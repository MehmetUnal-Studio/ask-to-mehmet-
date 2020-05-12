const socket = io();
const message = document.getElementById("message"),
    handle = document.getElementById("handle"),
    output = document.getElementById("output"),
    button = document.getElementById("button");


//send typing message
message.addEventListener('keypress', () => {
    socket.emit('userTyping', handle.value)
})


//send messages to clients
button.addEventListener('click', function () {
    socket.emit('userMessage', {
        handle: handle.value,
        message: message.value
    })
    document.getElementById('message').value = "";
});


//listen for events from the server
socket.on("userMessage", (data) => {
    typing.innerHTML = "";
    output.innerHTML += '<p> <strong>' + data.handle + ':</strong>' + data.message + '</p>'
})


socket.on('userTyping', (data) => {
    typing.innerHTML = '<p><em>' + data + " " + 'is typing to Mehmet... </em></p>'
})



/* video chat*/
function getLvideo(callbacks) {
    navigator.getUserMedia = navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia;
    var constraints = {
        audio: true,
        video: true
    }

    navigator.getUserMedia(constraints, callbacks.success, callbacks.error)
};

function recStream(stream, elemid) {

    var video = document.getElementsByClassName(elemid);
    video.srcObject = stream;
    window.peer_stream = stream;
}

getLvideo({
    success: function (stream) {
        window.localstream = stream;
        recStream(stream, 'lVideo');
    },
    error: function (err) {
        alert("kameran calismiyor abi");
        console.log(err);
    }
});

var conn;
var peer_id;

// create a peer connection whit peer obj
var peer = new Peer({ key: 'lwjd5qra8257b9' });

// display the peer id on the DOM
peer.on('open', function () {
    document.getElementById("displayId").innerHTML = peer.id
})

peer.on('connection', function (connection) {
    conn = connection;
    peer_id = connection.peer

    document.getElementById('connId').value = peer_id;
})

peer.on('error', function (err) {
    alert("an error has happened:" + err)
    console.log.apply(err);
})
// onClick whit the connection button = expose ice information each other

document.getElementById('conn_button').addEventListener('click', function () {
    peer_id = document.getElementById('connId').value;

    if (peer_id) {
        conn = peer.connect(peer_id)
    } else {
        alert("enter an id");
        return false;
    }
})

// call on click (offer and ansver is exchanged)
peer.on('call', function (call) {
    var acceptCall = confirm("Aramaya cevap vermek istiyor musun?");

    if (acceptCall) {
        call.answer(window.localstream);
        call.on('stream', function (stream) {
            window.peer_stream = stream;

            recStream(stream, 'rVideo')
        });
        call.on('close', function () {
            alert('Arama red edildi!');
        })
    } else {
        console.log("call denied")
    }
});


// ask to call
document.getElementById('call_button').addEventListener('click', function () {
    console.log("calling a better:" + peer_id);
    console.log(peer);

    var call = peer.call(peer_id, window.localstream);

    call.on('stream', function (stream) {
        window.peer_stream = stream;

        recStream(stream, 'rVideo');
    })
})

// accet the call

// display the remote video and local video on the clients