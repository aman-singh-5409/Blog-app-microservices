import dotenv from "dotenv";
dotenv.config();

import { ServerInit } from "./src/ServerInit";

process.on('warning', event => console.warn(event.stack));

let serverInit: ServerInit | undefined;

if(!serverInit) {
  serverInit = new ServerInit();
}

serverInit.appServer.listen();