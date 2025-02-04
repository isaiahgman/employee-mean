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
            additionalProperties: false,
            properties: {
                _id: {
                    bsonType: "objectId"
                },
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
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("employees", {validator: jsonSchema});
        }
    });
}


