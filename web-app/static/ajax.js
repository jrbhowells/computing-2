/*
ajax.js for To Do Calendar SP Web App
James Howells

CONTENTS

    1. Setup
    2. Ajax queries
        1. Overdue Tasks
        2. Future Due Tasks
        3. All Incomplete Tasks
        4. Edit a task
        5. Create a new task
        6. Mark a task as complete
        7. Get tags from tasks
        8. Sort tasks

*/

//1. Setup

const Ajax = Object.create(null);

const fetch = window.fetch;

const json = (response) => response.json();

// 2. Ajax queries

// 1. Get incomplete overdue tasks
Ajax.query_overdues = function () {

    return fetch("/overdues", {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        }
    }).then(json);
};

// 2. Get incomplete future due tasks
Ajax.query_futures = function () {

    return fetch("/futures", {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        }
    }).then(json);
};

// 3. Get all incomplete tasks
Ajax.query_incomplete = function () {

    return fetch("/incomplete", {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        }
    }).then(json);
};

// 4. Edit a task
Ajax.edit_task = function (requestObj) {
    const body = JSON.stringify(requestObj);

    return fetch("/edit-task", {
        "method": "POST",
        "body": body,
        "headers": {
            "Content-Type": "application/json"
        }
    }).then(json);
};

// 5. Create a new task
Ajax.create_new_task = function (requestObj) {
    const body = JSON.stringify(requestObj);

    return fetch("/new-task", {
        "method": "POST",
        "body": body,
        "headers": {
            "Content-Type": "application/json"
        }
    }).then(json);
};

// 6. Set a particular task to complete
Ajax.set_complete = function (requestObj) {
    const body = JSON.stringify(requestObj);

    return fetch("/set-complete", {
        "method": "POST",
        "body": body,
        "headers": {
            "Content-Type": "application/json"
        }
    }).then(json);
};

// 7. Get a set of tags for an array of tasks
Ajax.get_tags = function (requestObj) {
    const body = JSON.stringify(requestObj);

    return fetch("/get-tags", {
        "method": "POST",
        "body": body,
        "headers": {
            "Content-Type": "application/json"
        }
    }).then(json);
};

// 8. Sort tasks by due date/time or by number of tags
Ajax.sort_tasks = function (requestObj, reqString) {

    // Creates a composite 'body' consisting of the tasks to be sorted AND the
    // way in which they should be sorted.
    const body = JSON.stringify([
        requestObj,
        reqString
    ]);

    return fetch("/sort-tasks", {
        "method": "POST",
        "body": body,
        "headers": {
            "Content-Type": "application/json"
        }
    }).then(json);
};

export default Object.freeze(Ajax);
