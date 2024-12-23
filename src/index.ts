process.title = "zyae-auth-service";
Error.stackTraceLimit = process.env.NODE_ENV === "production" ? -1 : 10;

import { addAlias } from "module-alias";
addAlias("@", `${__dirname}/`);

import "reflect-metadata";
import "./handleExit";

import * as libs from "@/libs";

import { env } from "@/common";

libs.Logger.info(
  `zyae-auth-service with process id of ${process.pid} starting in ${env.keys.NODE_ENV} mode`
);
