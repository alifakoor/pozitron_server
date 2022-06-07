import { createServer } from "http";
import { Server } from "socket.io";
// const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const {
  addProductToOrder,
  getPendingOrders,
} = require("../controllers/order.controllers");
const { getAllProduct } = require("../controllers/product.controllers");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: [process.env.CORS_DOMAINS] },
});

// io.use((socket, next) => {
//     if (socket.handshake.auth?.token) {
//         jwt.verify(
//             socket.handshake.auth.token,
//             process.env.JWT_SECRET,
//             (err, decoded) => {
//                 if (err) return next(new Error("You are not authenticated."));
//                 const date = new Date();
//                 if (Math.floor(date.getTime() / 1000) > decoded.exp) {
//                     return next(new Error("Token is expired."));
//                 }
//                 socket.user = decoded.user;
//                 socket.business = decoded.business;
//                 next();
//             }
//         );
//     } else next(new Error('No token provided.'))
// });

io.on("connection", (socket) => {
  console.log("new user connected.");

  socket.on("addProductToCart", async (data) => {
    const result = await addProductToOrder(1, data.orderId, data.productId);
    if (result) {
      io.emit("resAddProduct", {
        status: true,
        message: "product added to the order.",
      });
    } else {
      io.emit("resAddProduct", {
        status: false,
        message: "add product to the order failed.",
      });
    }
  });

  const products = getAllProduct(1);
  io.emit("productList", { products });

  // socket.on("getProductList", async (data) => {
  // });

  const orders = getPendingOrders(1);
  io.emit("pendingOrders", { orders });

  // socket.on("getPendingOrders", async (data) => {
  // });
});

httpServer.listen(8081);

module.exports = io;
