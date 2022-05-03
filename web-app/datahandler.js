/*
datahandler.js for To Do Calendar SP Web App
James Howells

CONTENTS

    File contains task-manipulation functions for entire web-app

*/

import Datastore from "nedb";

const Datahandler = Object.create(null);

// Read in database
const database = new Datastore({
    filename: "web-app/database.db",
    autoload: "true"
});

// Gets all incomplete tasks from database
// Uses basic NeDB query: we use advanced list comprehension to sort the tasks
Datahandler.get_incomplete = function () {
    let tasks = new Promise(function (resolve) {
        database.find({complete: false}, function (ignore, docs) {
            resolve(docs);
        });
    });
    return tasks;
};

// Uses above to query database then filters out past tasks
Datahandler.get_futures = function () {
    let now = Date.now();
    let tasks = Datahandler.get_incomplete().then(function (tasks) {
        return tasks.filter((task) => task.due > now);
    });
    return tasks;
};

// Uses above to query database then filters out future tasks
Datahandler.get_overdues = function () {
    let now = Date.now();
    let tasks = Datahandler.get_incomplete().then(function (tasks) {
        return tasks.filter((task) => task.due < now);
    });
    return tasks;
};

// Creates a new task based on given inputs
Datahandler.new_task = function (task) {
    let datetime = new Date(task.date + " " + task.time).getTime();
    let task_arr = {
        due: datetime,
        name: task.name,
        notes: task.notes,
        tags: task.tags.split(" "),
        complete: false
    };

    database.insert(task_arr);
};

// Edits task attributes to those given
Datahandler.edit_task = function (task) {
    let datetime = new Date(task.date + " " + task.time).getTime();
    let task_arr = {
        due: datetime,
        name: task.name,
        notes: task.notes,
        tags: task.tags.split(" "),
        complete: false
    };

    database.update({"_id": task.id}, {"$set": task_arr});
};

Datahandler.set_complete = function (task) {
    database.update({"_id": task._id}, {"$set": {complete: true}});
};

// This function returns the tags of an input object filled with tasks
Datahandler.get_tags = function (tasks) {

    const second_try = function (f_t) {
        try {
            // This uses map() to return just the array of tags of the task
            let tg = f_t.map((x) => x.tags)[0];

            return tg;
        } catch (ignore) {
            return undefined;
        }
    };

    // Tasks with no tags at all are filtered out
    let filt_tasks = tasks.filter((task) => task.tags.length !== 0);


    try {
        // This uses .map to get an Array of tags from each task,
        // then it uses reduce 2x to combine the nested arrays into one,
        // comma-separated string. It then splits this into an Array and finally
        // converts it to a Set to remove duplicates.
        // The 2nd reduce is needed because tasks can have more than 1 tag.
        // The 2 trys are needed because not all tasks have more than 1 tag.
        let tgs = new Set(filt_tasks.map((x) => x.tags).reduce(
            (ac, cu) => ac + "," + cu.reduce(
                (a, c) => a + "," + c
            )
        ).split(","));

        return tgs;

    } catch (ignore) {
        return second_try(filt_tasks);
    }

};

// This function will sort tasks based on a parameter, 'sort.'
Datahandler.sort_tasks = function (tasks, sort = "date") {

    // The function used to compare tasks
    const compare_fcn = function (a, b) {
        if (sort === "date") {
            // If sort parameter = date, sorts tasks by date
            // This is used to populate the overdue tasks list
            return a.due - b.due;
        }
        if (sort === "tags") {
            // If sort parameter = tags, sorts tasks by number of tags
            // This is used to populate the tags popup.
            return b.tags.length - a.tags.length;
        }
    };

    if (tasks.length > 0) {
        return tasks.sort((a, b) => compare_fcn(a, b));
    }
    return tasks;
};

export default Object.freeze(Datahandler);