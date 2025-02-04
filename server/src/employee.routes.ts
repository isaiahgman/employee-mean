/*
    This is an important piece
    Here we have the first endpoint in the project, which is the empty path get.

    Here we can see the way that we can define endpoints in express, and it's pretty simple

    Some things to note before we move on:
        Defining a new endpoint is easy
        We have the req right there, and we use the res to respond back to the caller
        We are using async, which basically means that
*/

import * as express from "express";
import {collections} from "./database";
import {ObjectId} from "mongodb";

export const employeeRouter = express.Router();
employeeRouter.use(express.json());

employeeRouter.get("/", async (req, res) => {
    try {
        const employees = await collections?.employees?.find({}).toArray();
        res.status(200).send(employees);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

employeeRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params.id;
        const query = {_id: new ObjectId(id)};
        const employee = await collections?.employees?.findOne(query);

        if (employee) {
            res.status(200).send(employee);
        } else {
            res.status(404).send(`Failed to find an employee: ID ${id}.`)
        }
    } catch (error) {
        res.status(404).send(`Failure to find an employee: ID ${req.params?.id}`);
    }
});

employeeRouter.post("/", async (req, res) => {
    try {
        const employee = req.body;
        const result = await collections?.employees?.insertOne(employee);

        if (result?.acknowledged) {
            res.status(201).send(`Created a new employee: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failure to create a new employee.");
        }
    } catch (error) {
        if (error instanceof Error && (error as any).errInfo) {
            const errInfo = (error as any).errInfo;
            console.error(JSON.stringify(errInfo.details, null, 2));
        } else {
            console.error('An unknown error occurred:', error);
        }
    }
});

employeeRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const employee = req.body;
        const query = {_id: new ObjectId(id)};
        const result = await collections?.employees?.updateOne(query, {$set: employee});

        if (result && result.matchedCount) {
            res.status(200).send(`Updated an employee: ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find an employee: ID ${id}.`);
        } else {
            res.status(304).send(`Failure to update an employee: ID ${id}.`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.log(message);
        res.status(400).send(message);
    }
});

employeeRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = {_id: new ObjectId(id)};
        const result = await collections?.employees?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed an employee: ID ${id}.`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an employee: ID ${id}.`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an employee: ID ${id}.`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.log(message);
        res.status(400).send(message);
    }
});