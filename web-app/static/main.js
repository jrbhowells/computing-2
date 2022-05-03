/*
main.js for To Do Calendar Single Page Web App
James Howells

CONTENTS

    0. Javascript structure explanation
    1. Imports & setup
    2. Create a new task
    3. Edit an existing task
    4. Set up page on server start

*/

/*
0. Javascript structure explanation

The Javascript files are divided in the following way:

     1. This file, main.js
        This file is called by index.html & populate.js.
        It handles the following:
            - Calling populate.js to populate fields
            - Functions related to editing tasks
            - Calling the database for the above (via AJAX & datahandler.js)

     2. animate.js
        animate.js is called by main.js & populate.js.
        It handles the following:
            - Creating generic field-handling functions
            - Onclicks for page animations (show/hide popups etc)

     3. populate.js
        populate.js is called by main.js.
        It handles the following:
            - Populating the main calendar with correct dates & tasks
            - Populating popups with task-specific information
            - Calling the database for the above (via AJAX & datahandler.js)

    4.  ajax.js
        ajax.js is called by main.js and populate.js
        It handles the following:
            - Processing server (and thus database) interactions with the above

    Each file has its own contents page.
*/

// 1. Imports

import Ajax from "./ajax.js";
import Animate from "./animate.js";
import Populate from "./populate.js";

const Edit = Object.create(null);

// Function to clear popups of input and repopulate calendar
Edit.clear_populate = function () {
    // Populate the site with database data
    Populate.populate_overdue_tasks();
    Populate.populate_calendar();
    Populate.populate_tags();

    // Hide & clear popups of any legacy input
    Animate.clear();
    Animate.hide_popups();
};

// 2. Create a new task

// Function creates new task
Edit.create_new_task = function () {

    // Calls AJAX to create task
    Ajax.create_new_task({
        name: document.getElementById("name").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        notes: document.getElementById("notes").value,
        tags: document.getElementById("tags").value
    });

    Edit.clear_populate();
};

// 3. Edit an existing task

// Updates task info by passing new values wholesale to datahandler via ajax
Edit.edit_current_task = function (task) {

    // Calls AJAX to edit task
    // THIS GIVES A JSLINT ERROR: This cannot be corrected as JS Lint does not
    // like property names beginning with an _
    Ajax.edit_task({
        id: task._id,
        name: document.getElementById("name").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        notes: document.getElementById("notes").value,
        tags: document.getElementById("tags").value
    });

    Edit.clear_populate();
};

export default Object.freeze(Edit);

// 4. Set up page on server start

// Populate relevant data, clear fields of legacy data & hide popups
Edit.clear_populate();

// Handles light / dark mode
const elem = document.documentElement;
const check_state = function () {
    if (document.getElementById("dark-tick").checked === true) {
        elem.style.setProperty("--col-a", "rgb(209, 209, 209)");
        elem.style.setProperty("--col-b", "rgb(43, 43, 43)");
        elem.style.setProperty("--glass-col", "rgba(43, 43, 43, 0.9)");
        elem.style.setProperty("--grey-col", "rgb(182, 182, 182)");
        elem.style.setProperty("--red-col", "rgb(160, 29, 29)");
    }
    if (document.getElementById("dark-tick").checked === false) {
        elem.style.setProperty("--col-a", "rgb(43, 43, 43)");
        elem.style.setProperty("--col-b", "rgb(209, 209, 209)");
        elem.style.setProperty("--glass-col", "rgba(141, 141, 141, 0.9)");
        elem.style.setProperty("--grey-col", "rgb(73, 73, 73)");
        elem.style.setProperty("--red-col", "rgb(204, 48, 48)");
    }
};

// Checks initial state of dark mode checkbox
check_state();

// Handles changing to dark mode on check box click
document.getElementById("dark-tick").onclick = function () {
    check_state();
};

// Setup listener for creating task on click
document.getElementById("create").onclick = function () {
    Edit.create_new_task();
    Edit.clear_populate();
};