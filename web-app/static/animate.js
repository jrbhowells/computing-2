/*
animate.js for To Do Calendar SP Web App
James Howells

CONTENTS

    1. Setup
    2. Generic field-handling functions
    3. Onclicks

*/

// 1. Setup

const Animate = Object.create(null);

// Variables for html elements we use later:
const taskname = document.getElementById("name");
const taskdate = document.getElementById("date");
const tasktime = document.getElementById("time");
const tasknotes = document.getElementById("notes");
const tasktags = document.getElementById("tags");

const newtask = document.getElementById("new-popup");

const seetags = document.getElementById("tags-popup");

const dayinfo = document.getElementById("day-info");

const taskinfo = document.getElementById("task-info");

const banner = document.getElementById("banner");
const main = document.getElementById("main");


// 2. Generic field-handling functions

// Function to clear task input fields
Animate.clear = function () {
    taskname.value = "";
    taskdate.value = "";
    tasktime.value = "";
    tasknotes.value = "";
    tasknotes.value = "";
    tasktags.value = "";
};

// Function to hide all popups
Animate.hide_popups = function () {
    newtask.style.visibility = "hidden";
    dayinfo.style.visibility = "hidden";
    taskinfo.style.visibility = "hidden";
    seetags.style.visibility = "hidden";
};

// 3. Onclicks

// Show overdue tasks area.
banner.onclick = function () {
    main.style.display = "inline";
    banner.style.display = "none";
};

// Hide overdue tasks area.
main.onclick = function () {
    main.style.display = "none";
    banner.style.display = "inline";
};

// Show new task popup
document.getElementById("show-popup").onclick = function () {
    Animate.hide_popups();
    Animate.clear();
    newtask.style.visibility = "visible";
};

// Show tags popup
document.getElementById("tag-button").onclick = function () {
    Animate.hide_popups();
    seetags.style.visibility = "visible";
};

// Hide tags popup
document.getElementById("done").onclick = function () {
    Animate.hide_popups();
};

// Clear task fields on click
document.getElementById("clear").onclick = Animate.clear;

// Cancel creating task & clear fields on click
document.getElementById("cancel").onclick = function () {
    Animate.hide_popups();
    Animate.clear();
};

// Hide day-info popup on click
document.getElementById("close").onclick = function () {
    Animate.hide_popups();
};

// Hide task-info popup on click
document.getElementById("ok").onclick = function () {
    Animate.hide_popups();
};

// Show edit task popup
document.getElementById("edit-popup").onclick = function () {
    Animate.hide_popups();
    newtask.style.visibility = "visible";
};

export default Object.freeze(Animate);