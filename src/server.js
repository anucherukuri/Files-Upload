import express from "express";

import cors from "cors";

import listEndpoints from "express-list-endpoints";

import authorsRouter from "./services/authors/index.js";

import blogPostsRouter from "./services/blogPosts/index.js";

import filesRouter from "./services/files/index.js"


import { badRequestHandler, unauthorizedHandler, notFoundHandler, genericErrorHandler } from "./errorHandlers.js"

const server = express();

const PORT = 3001;

server.use(cors());

server.use(express.json());

// *********************************** ENDPOINTS *************************************

server.use("/authors", authorsRouter);
server.use("/blogPosts", blogPostsRouter);
server.use("/files", filesRouter);

// ********************************** ERROR HANDLERS *********************************

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

// *********************************** Displaying list of end-points ********************** 
console.log(listEndpoints(server));

server.listen(PORT, () => console.log("✅ Server is running on port : ", PORT));

server.on("error", (error) =>
  console.log(`❌ Server is not running due to : ${error}`)
);
