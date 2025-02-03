// this is going to be like a definition of the employee object
// we are going to use this then as we interact with mongoDB
// the attributes that we are saving for a given employee are pretty straightforward
import * as mongodb from "mongodb";

export interface Employee {
    name: string;
    position: string;
    level: "junior" | "mid" | "senior";
    _id: mongodb.ObjectId;
}