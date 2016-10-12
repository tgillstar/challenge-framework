;(function() {

    // Create a 'new' TestingFramework object
    var TestingFramework = function(code) {
        return new TestingFramework.init(code);
    };

    // The program "must have" the following elements within its code
    var testForWhiteList = [
        {
            type: "VariableDeclaration",
            has: false
        },
        {
            type: "ForStatement",
            has: false
        }
    ];
    // The program "must not have" the following elements within its code
    var testForBlackList = [
        {
            type: "SwitchStatement",
            has: false
        },
        {
            type: "WhileStatement",
            has: false
        }
    ];

    // The program "must have" code within it that has the syntax structure as noted below
    var testForRequiredList = [
        {
            type: "ForStatement",
            has: false,
            index: -1,
            body: {
                type: "BlockStatement",
                has: false,
                index: -1,
                body: [
                        {
                        type: "IfStatement",
                        has: false,
                        index: -1,
                        body: {
                            type: "BlockStatement",
                            has: false,
                            index: -1,
                            body: [
                            ]
                        }
                    }
                ]
            }
        }
    ];

    // Makes a clone of an Array-like Object
    function cloneObject(obj) {

        // Check if passed "Object" is truly an Object or not
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        // give temp the original obj's constructor
        var temp = obj.constructor();

        // Loop through each key and clone each of each children
        for (var key in obj) {
            temp[key] = cloneObject(obj[key]);
        }
        return temp;
    }

    //// TESTING FRAMEWORK'S PROTOTYPE
    TestingFramework.prototype = {

        // Function to traverse the JSON-formatted code
        traverse: function(node, func) {
            // Get 'this' execution context's reference
            var self = this;

            // Run function passed on the current node
            func(node);

            // Loop through each node
            for (var key in node) {

                // Check if the node has current property
                if (node.hasOwnProperty(key)) {
                    var child = node[key];

                    // Check if this child node is an Object
                    if (typeof child === 'object' && child !== null) {

                        // Check if this Object is an Array
                        if (Array.isArray(child)) {

                            // If this child node is an Array then traverse it's children first
                            child.forEach(function (node) {
                                self.traverse(node, func);
                            });
                        } else {

                            // If this child node is not an Array then continue with current iteration's traversal
                            self.traverse(child, func);
                        }
                    }
                }
            }
        },

        // Function to analyze code entered by the User
        analyzeCode: function() {
            var self = this;

            // Traverse each node in the User code
            this.traverse(self.code, function (node) {

                // Run White list test
                self.basicCheckList(node.type, self.trackWhiteList, true);

                // Run Black list test
                self.basicCheckList(node.type, self.trackBlackList, true);

                // Run Required list test
                self.checkRequiredList(node.type);
            });
        },

        // Function to check to see if list items match any in User's code
        basicCheckList: function (nodeTraversed, listToCheck, setBoolean){

            // Check to see if the any of the node entered by the User is on the White List
            for (var element in listToCheck) {

                // Create a variable with the current element's type
                var nodeToCheck = listToCheck[element].type;

                // Check to see if there is a match
                if (nodeToCheck == nodeTraversed) {

                    // Set the boolean element inside of the specific list
                    listToCheck[element].has = setBoolean;
                }
            }
        },

        // Function to check for Required List
        checkRequiredList: function (nodeTraversed){
            var self = this;

            // Check to see if the syntax structure matches the Required List
            for (var element in self.trackRequiredList) {

                // Create a variable with the current element's type
                var nodeToCheck = self.trackRequiredList[element].type;

                // Check to see if there is a match
                if (nodeToCheck == nodeTraversed) {

                    // Set the boolean element
                    self.trackRequiredList[element].has = true;

                    //UNFINISHED CODE
                        // Look for this node in the original JSON object

                        // Get this node's id

                        // Save the node's id in trackRequiredList

                        // Break out of traverse function

                    //---
                }
            }
        },

        // Return the prettified list with passed title
        processResults: function(title, arr) {
            var results = '<h4>' + title + '</h4>' + JSON.stringify(arr,null,2);

            return results;
        },

        // Return the current tracked White list
        getWhiteList: function(){
            return this.trackWhiteList;
        },

        // Return the current tracked Black list
        getBlackList: function(){
            return this.trackBlackList;
        },

        // Return the current tracked Required list
        getRequiredList: function(){
            return this.trackRequiredList;
        }
    };

    // TestingFramework object creation
    TestingFramework.init = function(code) {
        var self = this;

        self.code = code || '';

        // Clone a copy of each list to this instance of the TestingFramework object
        self.trackWhiteList = cloneObject(testForWhiteList);
        self.trackBlackList = cloneObject(testForBlackList);
        self.trackRequiredList = cloneObject(testForRequiredList);

    };

    // So we don't have to use the 'new' keyword
    TestingFramework.init.prototype = TestingFramework.prototype;


    //// MAIN PROCESS

    // DOM element where the TestingFramework's results will be displayed
    var resultsDiv = document.getElementById("results");

    // Create a DOM element to hold results
    var tree = document.createElement("div");

    // Esprima parsing options
    var options = {
        sourceType: 'script'
    };
    // Variables for User's keypress delay settings
    var timer,
        delay = 2000;

    // Execute this code once the User has paused
    function executeCode(){
        // Create a new instance of the TestingFramework object
        var testing = TestingFramework(esprima.parse(editor.getValue(), options));

        // Send the code (currently in editor) to be analyzed
        testing.analyzeCode();

        // Save a copy of the results of each testing list to the newly created DOM element
        tree.innerHTML= testing.processResults('Must Haves',testing.getWhiteList());
        tree.innerHTML+= testing.processResults('Must Not Haves',testing.getBlackList());
        tree.innerHTML+= testing.processResults('Required Structure',testing.getRequiredList());

        // Append the newly created DOM element to the specified DOM element in the body
        resultsDiv.appendChild(tree);
    }

    // Everything happens once the user presses a key.
    // Continuously process and push out the results to the user
    editor.on("keyup",function(cm, event){

        // If the user is still typing then clear timer and reset
        if (typeof timer != "undefined") {
            clearTimeout(timer);
            timer = 0;
        }

        // Wait until for the user's keyup event to has stopped for 2 seconds before beginning
        timer = setTimeout(executeCode, delay);
    });

})();