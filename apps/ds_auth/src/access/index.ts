import AuthDB from "./db-access";
import {loggers} from "../logger";

const db = new AuthDB(loggers.basicLogger);

export default db;