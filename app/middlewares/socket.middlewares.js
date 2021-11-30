const socket_io = require("socket.io")
const eventsController = require("../controllers/events.controllers")

class socketMiddlewares {
    #OPTIONS = {
        cors: {
            origin: ["http://pozitron.local", "http://localhost:8080"]
        }
    }
    io = null
    controller = null
    sockets = []
    constructor (httpServer) {
        this.io = socket_io(httpServer, this.#OPTIONS)
        this.controller = eventsController(this.io)

        this.io.on("connection", socket => {
            console.log(`A user connected on socket: ${socket.id}`)

            socket.on("online", data => {
                sockets[data.userId] = socket.id
            })

            socket.on("getPreviousOrders", (data) => {
                const result = this.controller.getPreviousOrders(data)
                this.io.sockets.emit("public", {data: result})
            })

            socket.on("getAllProductsForCart", async () => {
                const products = await this.controller.getAllProductsForCart()
                this.io.sockets.emit("allProductsForCart", products)
            })

            socket.on("updateProductStock", async (data) => {
                const result = await this.controller.updateProductStock(data)
                if (result) {
                    const products = await this.controller.getAllProductsForCart()
                    this.io.sockets.emit("allProductsForCart", products)
                }
                // this.io.sockets.emit("updatedProductStock", result)
            })

            // socket.on("saveCurrentCart", async () => {
            //     const result = await this.controller.saveCurrentOrder()
            //     console.log(result)
            // })
        })

        this.io.on("disconnect", socket => {
            console.log(`A user Disconnected from socket: ${socket.id}`)
        })
    }
}

module.exports = socketMiddlewares