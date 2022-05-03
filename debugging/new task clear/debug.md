**CID:** 01855361

# Debugging Dcreating a task from the webapp

This file explains the images in this directory

## 1. Creating tasks fails
After trying to create a task from the webpage, this is what appeared in the database. This task exists, but doesn't contain all the necessary information.

## 2. Test direct reation
I decided to test creating a task directly from the JavaScript. This worked and the task was created successfully. Thanks to this, I now know that the error is on the client side or with the AJAX queries.

## 3. Issue Traced
After digging around a bit it turned out that the client side program was not returning any data at all to Ajax - it was telling the server to create a task, but not what should be in the task.

## 4. Issue Found
As is almost always the case, the issue was irritatingly simple. I was clearing the task input fields before reading their values to create the task. It was never going to work! Fortunately, this is easy to solve.

## 5. Solved
I simply put the clear(); after the call to create the task.

## 6. Done
This worked well.