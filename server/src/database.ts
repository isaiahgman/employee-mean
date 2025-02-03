/*
    This is where we are going to connect to the DB
    Some questions that I already have are:
        how do we connect
        what are the login credentials, and how do we set those up
        what do those database interactions and queries look like

    At first we are importing mongodb, which makes sense
    But we are also importing the Employee model that we just created
        we are going to use that somehow in the database interactions

    There are a few things to think through here.
    We are connecting to the database using a uri, where does that uri come from, not sure yet.

    Next, in the connect to database function, we go ahead and grab all the employees I think

    finally we have a schema valiation, which makes sure that the data is in the shape that we
    have defined in employee.ts
*/


import * as mongodb from "mongodb";
import {Employee} from "./employee";

export const collections: {
    employees?: mongodb.Collection<Employee>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("employees");
    await applySchemaValidation(db);

    collections.employees = db.collection<Employee>("employees");
}

async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "position", "level"],
            additonalProperties: false,
            properties: {
                name: {
                    bsonType: "string",
                    description: "'name' must be a string and is required"
                },
                position: {
                    bsonType: "string",
                    description: "'position' must be a string and is required"
                },
                level: {
                    bsonType: "string",
                    description: "'level' must be one of 'junior', 'mid', or 'senior' and is required",
                    enum: ["junior", "mid", "senior"]
                }
            }
        }
    };

    await db.command({
        collMod: "employees",
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName !== "NamespaceNotFound") {
            await db.createCollection("employees", {validator: jsonSchema});
        }
    });
}


