/*
populate.js for To Do Calendar SP Web App
James Howells

CONTENTS

    1. Imports & setup
    2. Populate header of date-specific popup with corect date
    3. Populate task-info popup & overdue task list
    4. Populate the calendar itself
    5. Populate tags popup

*/

// 1. Imports & setup

import Ajax from "./ajax.js";
import Animate from "./animate.js";
import Edit from "./main.js";

const Populate = Object.create(null);

// Variables for html elements we use later:
const taskname = document.getElementById("name");
const taskdate = document.getElementById("date");
const tasktime = document.getElementById("time");
const tasknotes = document.getElementById("notes");
const tasktags = document.getElementById("tags");

const dayinfo = document.getElementById("day-info");

const taskinfo = document.getElementById("task-info");

const warn = document.getElementsByClassName("warning")[0];

const tag_selector = document.getElementById("tag-selector");

// 2. Populate header of date-specific popup with corect date

// Days of the week, in the JS order (used in return_clicked_date)
const days_of_week = ([
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
]);

// Months of the year (used in return_clicked_date)
const months_of_year = ([
    "January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"
]);

// Function to set popup header to correct date
const return_clicked_date = function (clicked_date) {
    clicked_date = new Date(clicked_date);

    // Gets word for day of week (js returns an int 0-6)
    const day = days_of_week[clicked_date.getDay()];

    // Gets word for month (js returns an int 0-11)
    const month = months_of_year[clicked_date.getUTCMonth()];

    // Calculates days until date by using no. miliseconds left and converting
    const milisecs_to_go = (clicked_date.getTime() - Date.now());
    const days_to_go = Math.ceil(milisecs_to_go / (1000 * 60 * 60 * 24));

    // Adds relevant day, date and month to popup header
    document.getElementById("today").innerHTML = (
        `${day} the ${clicked_date.getDate()} of ${month}<div class='label'
        style='text-align: center; transform: translate(0, -100%);'>
        ${days_to_go} days time &bull; Click task to edit</div>`
    );
};

// 3. Populate task-info popup & overdue task list

// Populates task-info popup and task edit screen based on 'input_task'
const populate_task_popup = function (input_task) {

    // Creates due date as a human-readable string
    const duedate = new Date(input_task.due);
    const date = (
        duedate.getDate()
        + "/" + duedate.getUTCMonth()
        + "/" + duedate.getFullYear()
    );

    // Creates due time as a human-readable string, with correct minutes
    // (otherwise shown as int, e.g. 13:0 instead of 13:00)
    const time = function () {
        if (duedate.getMinutes().toString().length === 1) {
            return duedate.getHours() + ":" + "0" + duedate.getMinutes();
        }
        return duedate.getHours() + ":" + duedate.getMinutes();
    };

    // The below does the actual populating based on the above constants
    // Note that date and time input fields do not have a placeholder attribute
    // so these have to be left out.
    // This also populates the edit-task popup should the user decide to edit.
    document.getElementsByName("name")[0].innerText = input_task.name;
    taskname.value = input_task.name;
    document.getElementsByName("due-date")[0].innerText = date;
    taskdate.value = date;
    document.getElementsByName("time")[0].innerText = time();
    tasktime.value = time();
    document.getElementsByName("notes")[0].innerText = input_task.notes;
    tasknotes.value = input_task.notes;
    tasktags.value = input_task.tags.join(" ");

    // Create onclick listener for task edit
    document.getElementById("create").onclick = function () {
        Edit.edit_current_task(input_task);

        // Re-create listener for task creation once task is edited
        document.getElementById("create").onclick = function () {
            Edit.create_new_task();
        };
    };

    // Re-create listener for task creation if user closes task info
    // popup without editing
    document.getElementById("ok").onclick = function () {
        Animate.hide_popups();

        document.getElementById("create").onclick = function () {
            Edit.create_new_task();
        };
    };
};

// Clone templates from html
const cloneTemplate = function (id) {
    return document.importNode(document.getElementById(id).content, true);
};

// Populates a <ul> object with id=/list/ with tasks from /tasks/. /bool/ states
// whether returned list should have due date or time.
// e.g. bool=true:  "25/10/2021 Sample Task"
//      bool=false: "13:00 Sample Task"
// This function also adds relevant listeners for click events to list elements.
const return_list_tasks = function (tasks, bool, list) {
    // First, clears list of any other tasks from previous runs.
    document.getElementById(list).innerHTML = "";

    // Iterate through list of tasks
    tasks.forEach(function (indiv_task) {

        // Get datetime of this task (Nth in iteration)
        const datetime = new Date(indiv_task.due);

        // Correct minutes (otherwise shown as int, e.g. 13:0 instead of 13:00)
        const minutes = function () {
            if (datetime.getMinutes().toString().length === 1) {
                return "0" + datetime.getMinutes();
            }
            return datetime.getMinutes();
        };

        // Gets date if bool=true (see above)
        // Otherwise return "" for date
        const returnand = function () {
            if (bool === true) {
                return (
                    datetime.getDate() + "/" +
                    datetime.getUTCMonth() + "/" +
                    datetime.getFullYear()
                );
            } else {
                return datetime.getHours() + ":" + minutes();
            }
        };

        // Get template from html file & populate it
        let new_indiv_task = cloneTemplate("list-elem");
        new_indiv_task.querySelector("[name=list-task]").textContent = (
            returnand() + " " +
            indiv_task.name
        );

        // Create onclick listener for list element - opens task info popup
        new_indiv_task.querySelector("[name=list-task]").onclick = function () {
            populate_task_popup(indiv_task);
            Animate.hide_popups();
            taskinfo.style.visibility = "visible";
        };

        //Create onclick listener for 'complete task' button
        new_indiv_task.querySelector("[class=tick]").onclick = function () {
            Ajax.set_complete(indiv_task);
            Edit.clear_populate();
        };

        // Add <li> element to list
        document.getElementById(list).appendChild(new_indiv_task);
    });
};

// Populate overdue tasks list
Populate.populate_overdue_tasks = function () {

    // Get overdue tasks
    Ajax.query_overdues().then(function (response) {
        // If overdue tasks exist, shows overdue task warning
        if (response.data.length !== 0) {
            warn.style.visibility = "visible";
        }

        // Sorts tasks by date and displays them in overdue task list
        Ajax.sort_tasks(response.data, "date").then(function (sorted_tasks) {
            return_list_tasks(sorted_tasks.reply, true, "overdue-list");
        });
    });
};

// 4. Populate the calendar itself

// Populate calendar grid with dates and add listeners for user clicks to each.
// Also add any tasks to each day.
Populate.populate_calendar = function () {

    // Calculate the date of the first day to be shown on the cal
    let day = new Date();
    day.setHours(0);
    day.setMinutes(0);
    day.setSeconds(0);
    day.setMilliseconds(0);
    let today_date = new Date(day);
    if (day.getDay() === 0) {
        day.setDate(day.getDate() - 6);
    } else {
        day.setDate(day.getDate() - (day.getDay() - 1));
    }

    // Get all <td>s collected into an array
    let tds = Array.from(document.getElementsByTagName("td"));

    Ajax.query_futures().then(function (response) {
        let tasks = response.data;
        tds.forEach(function (element) {

            // Gets human-readable date of cell currently being created
            let date = (
                day.getDate() + "/" +
                day.getUTCMonth() + "/" +
                day.getFullYear()
            );

            // Style today's calendar cell differently
            if (day.valueOf() === today_date.valueOf()) {
                element.className = "today-select";
            }

            // Creates empty array for tasks falling due on above date
            const days_tasks = [];

            // Filters tasks, finding which due date = above date.
            let today_tasks = tasks.filter(function (task) {
                let datetime = new Date(task.due);

                let due_date = (
                    datetime.getDate() + "/" +
                    datetime.getUTCMonth() + "/" +
                    datetime.getFullYear()
                );
                return due_date === date;
            });

            // Pushes those that match into today's cell
            today_tasks.forEach(function (task) {
                days_tasks.push(task);
            });

            // Uses .map to get array of task names from array of tasks
            let days_tasks_names = days_tasks.map((task) => task.name);

            // Checks to make sure day is today or future. If past, doesn't
            // populate table cell as overdue tasts are shown elsewhere.
            if (day.valueOf() >= today_date.valueOf()) {
                // Sets innerHTML of td element to correct value
                // Not template because of complexity of returns.
                element.innerHTML = (
                    "<div class='date-label'>" + day.getDate() + "</div>" +
                    days_tasks_names.join("<br>")
                );

                // Sets the id of the element to it's date
                element.id = day;

                // Sets listener for cell click
                element.onclick = function () {
                    // Sets date of popup header
                    return_clicked_date(element.id);

                    // Sets popup tasks
                    return_list_tasks(days_tasks, false, "today-list");

                    // Hides any other popups
                    Animate.hide_popups();

                    // Sets day-info popup to show
                    dayinfo.style.visibility = "visible";
                };
            } else {
                // Turn off borders for dates in the past
                element.style.border = "none";
                element.style.cursor = "auto";
            }

            // Adds 1 to the date for the next running of the iteration
            day.setDate(day.getDate() + 1);
        });
    });
};

// 5. Populate tags popup
Populate.populate_tags = function () {

    Ajax.query_incomplete().then(function (incompletes) {
        Ajax.get_tags(incompletes.data).then(function (tag_arr) {
            // Clear dropdown of previous tags
            document.getElementById("tag-selector").innerHTML = (
                "<option>--Select a Tag--</option>"
            );

            // Iterate through above tags & create a task_selector dropdown menu
            tag_arr.reply.forEach(function (tag) {

                let dropdown = cloneTemplate("dropdown");
                dropdown.querySelector("[name=dd-option]").textContent = tag;
                if (tag === "") {
                    dropdown.querySelector("[name=dd-option]").textContent = (
                        "Tagless"
                    );
                }
                dropdown.querySelector("[name=dd-option]").value = tag;

                tag_selector.appendChild(dropdown);
            });

            // On change of the task_selector dropdown menu, get correct tasks
            tag_selector.onchange = function () {

                // Use .filter and .some to get tasks which have the tag chosen
                // by the user in the dropdown
                let tasks = incompletes.data.filter((t) => t.tags.some(
                    (tg) => tg === tag_selector.value
                ));

                // Sort the tasks found above based on how many tags they have,
                // then use the same list-creating function as before to
                // populate the popup, using a different html template
                Ajax.sort_tasks(tasks, "tags").then(function (sorted_tasks) {
                    return_list_tasks(sorted_tasks.reply, true, "tags-list");
                });
            };

        });
    });
};

export default Object.freeze(Populate);