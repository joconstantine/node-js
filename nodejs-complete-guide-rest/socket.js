let io;

module.exports = {
    init: (httpServer, origin) => {
        io = require('socket.io')(httpServer, {
            cors: {
                origin: origin,
            }
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized');
        }
        return io;
    }
}