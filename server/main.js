// const http = require("http");
const express = require("express");
const path = require("path")
// const { Server } = require('socket.io');
const mongoose = require("mongoose");
const Mongo_URL = "mongodb://127.0.0.1:27017/FlutterDemo";
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

//mongodb
main()
    .then(() => {
        console.log("Connected To DB");
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(Mongo_URL);
}

// app.use(express.static(path.resolve("./public")));

let items = [    
    {data:"data",},
    {data:"data2",},
    {data:"data3"}
];

app.get("/",(req,res)=> { 
    res.json(items)
})


app.listen(8080, () => {
    console.log("server is listing on port 8080")
})


// const server = http.createServer(app);
// const io = new Server(server);

// io.on("connection",(socket) => {
//     console.log('a user connectd', socket.id)
//     socket.on('disconnect',() => {
//         console.log('user dissconnected')
//     })
// })

// io.on("connection",(socket) => {
//     socket.on("user-message",(message) => {
//         io.emit("message", message);
//     });
// });




// io.emit("hello","world");

// io.on('connection',(socket) => {
//     socket.broadcast.emit("hi");
// });

// io.on('connection',(socket) => {
//     socket.on('chat message',(msg) => {
//         console.log("message", + msg);
//         io.emit('chat message',msg);
//     });
// });


// server.listen(8080, () => {
//     console.log("server is listing on port 8080")
// })

