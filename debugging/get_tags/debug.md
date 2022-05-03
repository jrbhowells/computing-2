**CID:** 01855361

# Debugging Datahandler.get_tags()

This file explains the images in this directory

## 1. Original function
Image 1. shows the function as was. This failed very quickly when tested (with the edge-case of a tagless task) as shown in 1.1 & 1.2. The error here relates to the map function

## 2. Improved
Image 2. uses try and catch to remove the map function if only 1 task is present
2.1 showes that this now throws a reduce-related erro2

## 3. Nested try
Image 3 shows a nested try/catch used to handle this. It works.

## 4. Multiple tasks
Image 4 shows testing the file with multiple tasks. 4.1 shows this failing - it returns an empty array.

4.2 shows removing tasks with no tags (with the call in 4.3)

4.4 shows the resolution to this, and 4.5 shows this working

## 5. Test file
Now that the above mostly works, I can use Mocha to test edge cases,
Image 5: It fails

5.1 shows that it is failing where inputted strings are empty. This is an error with the test file (in the .join(", "))

5.2 I can debug the test file by using .join("") instead.

5.3 This now fails when tag names have punctuation. This isnt realistic - tags do not have punctuation.

5.4 Using fc.base64String() instead of fc.String() solves the issue with the test file.

All tests now pass