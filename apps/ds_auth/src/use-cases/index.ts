import db from "../access";
import {createUserAccess} from "./user-access";
import {loggers} from "../logger";

export const userAccess = createUserAccess(db, loggers.basicLogger);




