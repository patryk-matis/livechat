const express = require("express");
const socket = require("socket.io");


const app = express();
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});


app.use(express.static("frontend")); //Jako fullstack użyłbym oczywiście React.js zamiast tego

const io = socket(server);

io.on("connection", socket => {
    socket.on("message", msg =>{
        socket.broadcast.emit("message", msg);
    });

    socket.on("typing", user => {
        socket.broadcast.emit("typing", user); 
    });

    socket.on("join", user => {
        socket.broadcast.emit("join", user);
        socket.userId = user;
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("user left", socket.userId);
    });

})