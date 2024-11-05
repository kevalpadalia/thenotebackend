// import { Server } from "socket.io";
// import express from "express";
// import http from "http";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//     cors: {
//         origin: true,
//         methods: '*',
//     }
// });

// let users = {}
// io.on("connection", (socket) => {
//     console.log("New client connected", socket.id);
//     const userId = socket.handshake.query.userId
//     if (userId) {
//         users[userId] = socket.id
//         console.log(users)
//     }
//     socket.on("joinRoom", (room) => {
//         socket.join(room);
//         console.log(`User joined the room: ${room}`);
//     });
//     socket.on("updateNotePosition", (data) => {
//         const { noteId, newPosition } = data;
//         socket.broadcast.emit("notePositionUpdated", { noteId, newPosition });
//     });
//     io.emit("activeUsers",Object.keys(users))
//     socket.on("disconnect", () => {
//         console.log("Client disconnected", socket.id);
//         delete users[userId]
//         io.emit("activeUsers",Object.keys(users))
//     });
// });

// export { app, io, server };



import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: true,
        methods: '*',
    }
});

let userMap = {}
function getAllConnectedUsers(projectId) {
    return Array.from(io.sockets.adapter.rooms.get(projectId) || []).map((socketId) => {
        return {
            socketId,
            userName:userMap[socketId]
        }
    })
}
io.on("connection", (socket) => {
    console.log(`socket connected: ${socket.id}`)
    socket.on('join', ({ projectId, userName }) => {
        userMap[socket.id] = userName
        socket.join(projectId)
        const users = getAllConnectedUsers(projectId)
        users.forEach(({socketId}) => {
            io.to(socketId).emit("joined", {
                users,
                userName,
                socketId:socket.id
            })
        })
    })
    socket.on('content-change', ({ projectId, content, noteId,userName }) => {
        io.to(projectId).emit("content-change-recieve", {
            projectId,
            content,
            noteId,
            userName
        })
    })
    socket.on('position-change', ({ projectId, newPosition, noteId, userName ,userId}) => {
        io.to(projectId).emit("position-change-recieve", {
            projectId,
            newPosition,
            noteId,
            userName,
            userId
        })
    })
    socket.on('note-delete', ({ projectId}) => {
        io.to(projectId).emit("on-note-delete", {
            projectId,
        })
    })
    socket.on('new-note', ({ projectId }) => {
        io.to(projectId).emit("new-note-recieve", {
            projectId,
        })
    })
    socket.on('switch-project', () => {
        const rooms = [...socket.rooms]
        rooms.forEach((projectId) => {
            socket.in(projectId).emit("disconnected", {
                socketId: socket.id,
                userName:userMap[socket.id]
            })
        })
        delete userMap[socket.id]
    })
    socket.on('leave-project', (userId) => {
        const rooms = [...socket.rooms]
        rooms.forEach((projectId) => {
            socket.in(projectId).emit("leave-project", {
                socketId: socket.id,
                userName: userMap[socket.id],
                userId
            })
        })
        delete userMap[socket.id]
    })
    socket.on('delete-project', () => {
        const rooms = [...socket.rooms]
        rooms.forEach((projectId) => {
            socket.in(projectId).emit("delete-project", {
                socketId: socket.id,
                userName:userMap[socket.id]
            })
        })
        delete userMap[socket.id]
    })
    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms]
        rooms.forEach((projectId) => {
            socket.in(projectId).emit("disconnected", {
                socketId: socket.id,
                userName:userMap[socket.id]
            })
        })
        delete userMap[socket.id]
        socket.leave()
    })
});

export { app, io, server };
