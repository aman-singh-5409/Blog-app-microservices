import dotenv from "dotenv";
import { ServerInit } from "./src/ServerInit";
dotenv.config();

process.on('warning', event => console.warn(event.stack));

let serverInit: ServerInit | undefined;

if(!serverInit) {
  serverInit = new ServerInit();
}

serverInit.appServer.listen();
