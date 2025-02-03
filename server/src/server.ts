/*
    We are going to be connecting now to the MongoDB Atlas instance that I just setup
    For that we just need the URI, and then not sure if we need the username or password
    That URI is probably a secret, hold on, I just realized the username and password
    are contained in that URI, so that is how that works

    There is an order of events here
        1. Connect to Database
        2. Create the express app
        3. We set up cors
        4. We start the server with app.listen
 */

import * as dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import {connectToDatabase} from "./database";
import {employeeRouter} from "./employee.routes";

dotenv.config();
const {ATLAS_URI} = process.env;

if (!ATLAS_URI) {
    console.error("No ATLAS_URI");
    process.exit(1);
}

connectToDatabase(ATLAS_URI).then(() => {
    const app = express();
    app.use(cors());
    app.use("/employees", employeeRouter);

    app.listen(8000, () => {
        console.log(`Server running at http://localhost:8000...`);
    });
}).catch((error) => console.error(error));

