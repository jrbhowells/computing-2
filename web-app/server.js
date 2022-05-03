/*
server.js for To Do Calendar SP Web App
James Howells

CONTENTS

    This file contains setup for the web-app server
    ** This file DOES NOT use sessions, because tasks are not user specific so it is not necesssary **

*/

import express from "express";
import Datahandler from "./datahandler.js";

const port = 8080;
const app = express();

app.use("/", express.static("web-app/static"));

app.use("/", express.json());

// Overdues query
app.post("/overdues", function (ignore, res) {
    Datahandler.get_overdues().then(function (tasks) {
        res.json({
            "message": "overdue tasks",
            "data": tasks
        });
    });
});

// Futures query
app.post("/futures", function (ignore, res) {
    Datahandler.get_futures().then(function (tasks) {
        res.json({
            "message": "future due tasks",
            "data": tasks
        });
    });
});

// All incomplete tasks query
app.post("/incomplete", function (ignore, res) {
    Datahandler.get_incomplete().then(function (tasks) {
        res.json({
            "message": "incomplete tasks",
            "data": tasks
        });
    });
});

// Edit task
app.post("/edit-task", function (req) {
    const reqObj = req.body;
    Datahandler.edit_task({
        id: reqObj.id,
        name: reqObj.name,
        date: reqObj.date,
        time: reqObj.time,
        notes: reqObj.notes,
        tags: reqObj.tags
    });
});

// New task
app.post("/new-task", function (req) {
    const reqObj = req.body;
    Datahandler.new_task({
        name: reqObj.name,
        date: reqObj.date,
        time: reqObj.time,
        notes: reqObj.notes,
        tags: reqObj.tags
    });
});

// Complete task
app.post("/set-complete", function (req) {
    const reqObj = req.body;
    Datahandler.set_complete(reqObj);
});

// Get tags
app.post("/get-tags", function (req, res) {
    const reqObj = req.body;

    res.json({
        "type": "tags",
        "reply": Array.from(Datahandler.get_tags(reqObj))
    });
});

// Sort tasks
app.post("/sort-tasks", function (req, res) {
    const reqObj = req.body[0];
    const reqStr = req.body[1];

    res.json({
        "type": "tasks",
        "reply": Datahandler.sort_tasks(reqObj, reqStr)
    });
});

app.listen(port, function () {
    console.log(`Listening on port ${port} – http://localhost:${port}`);
});
