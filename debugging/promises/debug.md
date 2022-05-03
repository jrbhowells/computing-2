**CID:** 01855361

# Debugging database calls

This file explains the images in this directory

## 1. No promise
At first, I tried getting data from the database like this. It did not work, because JS just carried on with the resto of the process but the necessaru data had not yet been returned, so it threw an error.

## 2. Promise
Using a promise so that the program can move on while waiting for the data to be retunred worked well.