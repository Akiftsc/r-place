const io = require('socket.io')();
const mongoose = require("mongoose");
const Brush = require("../../schemas/brushSchema");

io.on('connection', (socket) => {
    console.log("someone connected.")

    socket.on('brush', async message => {
        //? Make all the pixels white back.
        /* await Brush.updateMany({}, { color: 'FFFFFF' }); */
        const filter = { x: message.x, y: message.y };
        const update = { color: message.color[0] };
        await Brush.findOneAndUpdate(filter, update)
        socket.broadcast.emit('brush', message)



    })

});

module.exports = io;