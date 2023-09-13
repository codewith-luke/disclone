import db from "../access";
import {createUserAccess} from "./user-access";

export const userAccess = createUserAccess(db);

