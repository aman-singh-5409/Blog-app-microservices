import express from "express";
import { Exception } from "../utils/exceptions/Exception";

export type expressErrorCallBack = (
  error: Exception,
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) => void;
