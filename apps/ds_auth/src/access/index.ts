import AuthDB from "./db-access";
import {loggers} from "../logger";
import dbConn from "../db";

const db = new AuthDB(loggers.basicLogger, dbConn);

export default db;