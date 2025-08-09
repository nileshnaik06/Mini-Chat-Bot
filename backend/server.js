require("dotenv").config()
const app = require("./src/app")
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors')
const generateResponce = require("./src/services/ai.service")

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST']
    }
});

const chatHstory = []

io.on("connection", (socket) => {
    console.log('connected with socket io')

    socket.on("disconnect", () => {
        console.log('user disconnected')
    })

    socket.on('ai-message', async (data) => {
        // console.log(data)
        chatHstory.push({
            role: "user",
            parts: [{ text: data }],
        })
        const response = await generateResponce(chatHstory)
        socket.emit("query-response", { response })
        chatHstory.push(
            {
                role: "model",
                parts: [{ text: response }],
            }
        )
    })
});

httpServer.listen(3000, () => {
    console.log('server is running on post 3000')
});