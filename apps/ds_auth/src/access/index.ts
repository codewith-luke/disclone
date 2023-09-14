import AuthDB from "./db-access";
import {logger} from "../logger";

const db = new AuthDB(logger);

export default db;