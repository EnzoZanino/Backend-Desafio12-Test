//Modules imports:
import express from "express";
import handlebars from "express-handlebars";
import Handlebars from "handlebars";

//Passport imports
import passport from "passport";
import cookieParser from "cookie-parser";
import initializePassport from "./config/usersConfig.js";

//Routers imports:
import { ProductRouter } from "./routes/api/products.routes.js";
import { CartsRouter } from "./routes/api/carts.routes.js";
import { viewsRouter } from "./routes/views/views.routes.js";
import ticketRouter from "./routes/api/tickets.routes.js";
import emailRouter from "./routes/api/email.routes.js";
import usersRouter from "./routes/api/users.routes.js";
import jwtRouter from "./routes/api/jwt.routes.js";
import actionsRouter from "./routes/api/users.actions.routes.js";
import loggerRouter from "./routes/api/logger.routes.js";
import fakeUserRouter from "./routes/api/fakeUser.routes.js";

//Assets imports:
import { Server } from "socket.io";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import basePath from "./utils/path.js";
import { messagesService } from "./services/service.js";
import swaggerUiExpress from "swagger-ui-express";
import SwaggerSpecs from "../swaggerSpecs.js";

//Config imports
import config from "./config/config.js";
import MongoSingleton from "./config/mongodb_Singleton.js";
import cors from "cors";
import compression from "express-compression";
import { addLogger } from "./utils/logger.js";
import logger from "./utils/logger.js";

//Server
const app = express();
const PORT = config.port;
const httpServer = app.listen(PORT, () => {
  `Server listening on port ${PORT}`;
});

//Midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initializePassport();
app.use(passport.initialize());
app.use(cors());
app.use(
  compression({
    brotli: {
      enabled: true,
      zlib: {},
    },
  })
);
app.use(addLogger);

//Swagger
app.use(
  "/api/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(SwaggerSpecs)
);

//Handlebars
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
      ifRoleEquals: function (role, targetRole, options) {
        return role === targetRole ? options.fn(this) : options.inverse(this);
      },
    },
  })
);
app.set("view engine", "hbs");
app.set("views", `${basePath}/views`);

//Static
app.use(express.static(`${basePath}/public`));

//Mongoose
const mongoInstance = async () => {
  try {
    await MongoSingleton.getInstance();
  } catch (error) {
    logger.error(error);
  }
};
mongoInstance();

//SocketServer
const io = new Server(httpServer);

//Cookies
app.use(cookieParser("CoderS3cr3tC0d3"));

//Api routers
app.use("/api/products", ProductRouter);
app.use("/api/carts", CartsRouter);
app.use("/api/users", usersRouter);
app.use("/api/jwt", jwtRouter);
app.use("/api/actions", actionsRouter);
app.use("/api/email", emailRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/loggerTest", loggerRouter);
app.use("/api/fakeUser", fakeUserRouter);

//ViewRouter
app.use("/", viewsRouter);

//Socket
io.on("connection", (socket) => {
  logger.info("New client connected: " + socket.id);

  socket.on("message", async (data) => {
    logger.info(data);
    await messagesService.create(data);
  });

  socket.on("disconnect", () => {
    logger.info("Client disconnected: " + socket.id);
  });
});
