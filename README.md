# Javascript Code Editor Framework
===========

Analyze the JavaScript code entered by the User in the editor and determine if certain aspects of the code is written as expected. 

We'd like to be able to have a few testing APIs to work with, namely:

- A whitelist of specific functionality. For example, the ability to say "This program MUST use a 'for loop' and a 
'variable declaration'."
- A blacklist of specific functionality. For example, the ability to say "This program MUST NOT use a 'while loop' or an 
'if statement'."
- Determine the rough structure of the program. For example, "There should be a 'for loop' and inside of it there should 
be an 'if statement'."

------------

To run this project just open up ../challenge-framework/public/index.html in a browser. Then begin writing code. Once you
pause the testing API process your code.

------------
Explanations

1) I choose Esprima to parse the JavaScript code. I mainly chose Esprima because it provided a "type" property in its 
tree that made it easier to analyze the nodes. Also even through Acorn was only slightly faster in speed when location 
data was not enabled (which is the case for my submission) and I am not using any other Javascript libraries so I didn't 
feel like I missed out in the performance category. Lastly, I felt that Esprima has better documentation than Acorn so I 
was able to get right to work.

3) I designed and created a TestingFramework Object that can takes in a string of JavaScript code, parse it, and provide 
feedback based upon it every time the User pauses in typing code. 

4) I decided to use CodeMirror for the User's editor and there is another areas that displays the API feedback.

5) I added a script on the index.html that loads the JS files in a non-blocking way and doesn't slow-down the User's input.