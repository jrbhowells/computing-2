**CID:** 01855361

# Debugging Datahandler.sort_tasks()

This file explains the images in this directory.

It explains how I created the function checking its functionality using property-based testing every step of the way.

## 1. Original
This was the function as was at the beginning.

## 1.1. Fail
The first test tested function's behaviour for input arrays of length 1. This failed immediately.

## 1.2. Handling
I edited the funtion to handle short arrays.

## 1.3. Pass
This passed test 1

## 2., 2.1. Next Test
The next test tests that the first task to be returned is that with the smallest (earliest) time.

## 2.2. Fails
This test failed because I was comparing the size of a time object, without converting the time object to its unix time integer

## 2.3. Unix
By adding .getTime() to get the unix time value of the due date of the task I was able to fix this error. The testy now passes.

## 3. Sort by tags too
A second part of this function's functionality is that it should sort by number of tags - posts with many tags should be ranked higher than those with fer, when tag ranking is selected.

## 3.1. New code
With this new code, this functionality is achieved. I created an extra test to test this, and the test passes.