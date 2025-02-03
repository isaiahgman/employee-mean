/*
    We are going to be connecting now to the MongoDB Atlas instance that I just setup
    For that we just need the URI, and then not sure if we need the username or password
    That URI is probably a secret, hold on, I just realized the username and password
    are contained in that URI, so that is how that works
 */

import * as dotenv from "dotenv";
import * as express from "express";
import * as cors from "cors";
import { connectToDatabase } from "./database";

/*
    this one line here gets all the variables from .env, and now we can use them
    that seems really simple to me
 */
dotenv.config();

const { ATLAS_URI } = process.env;

/*
    Here we are checking whether the .env has the ATLAS_URI
 */
if (!ATLAS_URI) {
    console.error("No ATLAS_URI");
    process.exit(1);
}

/*
    There is an order of events here
        1. Connect to Database
        2. Create the express app
        3. We setup cors
        4. We start the server with app.listen
 */
connectToDatabase(ATLAS_URI).then(() => {
    const app = express();
    app.use(cors());

    app.listen(8000, () => {
        console.log(`Server running at http://localhost:8000...`);
    });
}).catch((error) => console.error(error));

