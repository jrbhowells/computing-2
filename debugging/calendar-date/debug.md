**CID:** 01855361

# Debugging populating the calendar

This file explains the images in this directory

## 1. Day of Week
The first iteration of the function worked well - but it failed because it would get the day of the week of any given date wrong. This is because days of the week are returned as an integer from 0 (Sunday) to 6 (Saturday) - here we want them to be returned from 0 (Monday) to 6 (Sunday)

## 2. Day of Week Better
The above issue solved by subtracting 1 from the day of the week. The operation is in brackets, so this is mathematically equivalnt to adding 1 (above) outside the brackets.

## 3. Right association, without today
This image was taken on the 13rd. As can be seen, the 23rd doesnt display in the top row of the calendar, as it should. This is an edge-case that only happens on certain days of the week because of the fact that we are using 0-6 to number the days rather than 1-7.

## 4. Fixed
The if-statement needed to catch and fix this error.