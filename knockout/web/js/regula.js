/*
 Regula: An annotation-based form-validation framework in Javascript
 Version 1.2.4-SNAPSHOT

 Written By Vivin Paliath (http://vivin.net)
 License: BSD License

 TODO: Add step validation to regula (like html5 step validation)
 TODO: Add URL validation to regula (like html5 url validation)
 Copyright (C) 2010-2012
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals
        root.regula = factory();
    }
}(this, function() {

    /**
     * This is for code completion. I use this pattern throughout the file. It's not really necessary, but it helps when
     * using an IDE. Think of them as analogous to C function-prototypes. :)
     *
     * @type {{configure: Function, bind: Function, unbind: Function, custom: Function, compound: Function, override: Function, validate: Function, Constraint: {}, Group: {}, DateFormat: {}}}
     */
    var regula = {
        configure: function (options) {},
        bind: function (options) {},
        unbind: function (options) {},
        custom: function (options) {},
        compound: function (options) {},
        override: function (options) {},
        validate: function (options) {},
        Constraint: {},
        Group: {},
        DateFormat: {}
    };

    /**
     * Configuration options that govern regula's behavior
     * @type {{validateEmptyFields: boolean, enableHTML5Validation: boolean, debug: boolean}}
     */
    var config = {
        validateEmptyFields: true,
        enableHTML5Validation: true,
        debug: false
    };

    /**
     * DOMUtils contains some convenience functions to look up information in the DOM.
     * @type {{friendlyInputNames: {}, getElementsByAttribute: Function, getAttributeValueForElement: Function, supportsHTML5Validation: Function}}
     */
    var DOMUtils = {
        friendlyInputNames: {},
        getElementsByAttribute: function(oElm, strTagName, strAttributeName, strAttributeValue) {},
        getAttributeValueForElement: function(element, attribute) {},
        supportsHTML5Validation: function() {}
    };

    DOMUtils = (function() {

        var friendlyInputNames = {
            form: "The form",
            select: "The select box",
            textarea: "The text area",
            checkbox: "The checkbox",
            radio: "The radio button",
            text: "The text field",
            password: "The password",
            email: "The email",
            url: "The URL",
            number: "The number",
            datetime: "The datetime",
            "datetime-local": "The local datetime",
            date: "The date",
            month: "The month",
            time: "The time",
            week: "The week",
            range: "The range",
            tel: "The telephone number",
            color: "The color"
        };

        /*
         Copyright Robert Nyman, http://www.robertnyman.com
         Free to use if this text is included
         */

        function getElementsByAttribute(oElm, strTagName, strAttributeName, strAttributeValue) {
            var arrElements = (strTagName == "*" && oElm.all) ? oElm.all : oElm.getElementsByTagName(strTagName);
            var arrReturnElements = []; //modified; used to say new Array();
            var oAttributeValue = (typeof strAttributeValue !== "undefined") ? new RegExp("(^|\\s)" + strAttributeValue + "(\\s|$)") : null;
            var oCurrent;
            var oAttribute;
            for (var i = 0; i < arrElements.length; i++) {
                oCurrent = arrElements[i];
                oAttribute = oCurrent.getAttribute && oCurrent.getAttribute(strAttributeName);
                if (typeof oAttribute == "string" && oAttribute.length > 0) {
                    if (typeof strAttributeValue === "undefined" || (oAttributeValue && oAttributeValue.test(oAttribute))) {
                        arrReturnElements.push(oCurrent);
                    }
                }
            }

            return arrReturnElements;
        }

        /*
         Original code from:
         http://stackoverflow.com/a/3755343/263004
         */

        function getAttributeValueForElement(element, attribute) {
            var result = (element.getAttribute && element.getAttribute(attribute)) || null;

            if (!result) {
                var attributes = element.attributes;

                for (var i = 0; i < attribute.length; i++) {
                    if (attributes[i].nodeName === attribute) {
                        result = attributes[i].nodeValue;
                    }
                }
            }

            return result;
        }

        /**
         * generates a random id
         * @return {String} - the generated id
         */

        function generateRandomId() {
            return "regula-generated-" + Math.floor(Math.random() * 1000000);
        }

        /**
         * Returns true if the browser supports HTML5 validation
         * @returns {boolean}
         */
        function supportsHTML5Validation() {
            return (typeof document.createElement("input").checkValidity === "function");
        }

        return {
            friendlyInputNames: friendlyInputNames,
            getElementsByAttribute: getElementsByAttribute,
            getAttributeValueForElement: getAttributeValueForElement,
            generateRandomId: generateRandomId,
            supportsHTML5Validation: supportsHTML5Validation
        };
    })();

    /**
     * ArrayUtils contains some convenience functions related to arrays.
     * @type {{explode: Function}}
     */
    var ArrayUtils = {
        explode: function(array, delimiter) {}
    };

    ArrayUtils = (function() {

        function explode(array, delimeter) {
            var str = "";

            for (var i = 0; i < array.length; i++) {
                str += array[i] + delimeter;
            }

            return str.replace(new RegExp(delimeter + "$"), "");
        }

        return {
            explode: explode
        };
    })();

    /**
     * MapUtils contains some convenience functions related to Maps.
     * @type {{iterateOverMap: Function, exists: Function, put: Function, isEmpty: Function}}
     */
    var MapUtils = {
        iterateOverMap: function(map, callback) {},
        exists: function(array, value) {},
        put: function(map, key, value) {},
        isEmpty: function(map) {}
    };

    MapUtils = (function() {
        return {
            iterateOverMap: function(map, callback) {
                var index = 0;
                for (var property in map) if (map.hasOwnProperty(property) && property !== "__size__") {

                    //the callback receives as arguments key, value, index. this is set to
                    //the map that you are iterating over
                    callback.call(map, property, map[property], index);
                    index++;
                }
            },

            exists: function(array, value) {
                var found = false;
                var i = 0;

                while (!found && i < array.length) {
                    found = value == array[i];
                    i++;
                }

                return found;
            },

            put: function(map, key, value) {
                if (!map.__size__) {
                    map.__size__ = 0;
                }

                if (!map[key]) {
                    map.__size__++;
                }

                map[key] = value;
            },

            isEmpty: function(map) {
                for (var key in map) if (map.hasOwnProperty(key)) {
                    return false;
                }

                return true;
            }
        };
    })();

    /**
     * Exceptions that regula throws. Also contains a utility method that makes it easy to generate exception messages.
     * @type {{Exception: {}, generateExceptionMessage: Function, explodeParameters: Function}}
     */
    var ExceptionService = {
        Exception: {},
        generateExceptionMessage: function(element, constraintName, message) {},
        explodeParameters: function(options) {}
    };

    ExceptionService = (function() {
        var Exception = {
            IllegalArgumentException: function (message) {
                this.name = "IllegalArgumentException";
                this.message = message;
            },
            ConstraintDefinitionException: function (message) {
                this.name = "ConstraintDefinitionException";
                this.message = message;
            },
            BindException: function (message) {
                this.name = "BindException";
                this.message = message;
            },
            MissingFeatureException: function (message) {
                this.name = "MissingFeatureException";
                this.message = message;
            }
        };

        //Make sure our errors extend the native Exception object
        for (var errorType in Exception) if (Exception.hasOwnProperty(errorType)) {
            var error = Exception[errorType];
            error.prototype = new Error();
            error.prototype.constructor = error;
        }

        function generateExceptionMessage(element, constraintName, message) {
            var errorMessage = "";

            if (element != null) {
                errorMessage = element.id;

                if (constraintName == "" || constraintName == null || constraintName == undefined) {
                    errorMessage += ": ";
                } else {
                    errorMessage += "." + constraintName + ": ";
                }
            } else {
                if (constraintName != "" && constraintName != null && constraintName != undefined) {
                    errorMessage = "@" + constraintName + ": "
                }
            }

            return errorMessage + message;
        }

        /**
         * TODO: I am not entirely convinced that this is the right place for this
         * @param options
         * @return {String}
         */
        function explodeParameters(options) {
            var str = "Function received: {";
            for (var argument in options) if (options.hasOwnProperty(argument)) {

                if (typeof options[argument] == "string") {
                    str += argument + ": " + options[argument] + ", ";
                } else if (options[argument] instanceof Array) { //we need this to be an array
                    str += argument + ": [" + ArrayUtils.explode(options[argument], ", ") + "], "
                }
            }

            str = str.replace(/, $/, "") + "}";
            return str;
        }

        return {
            Exception: Exception,
            generateExceptionMessage: generateExceptionMessage,
            explodeParameters: explodeParameters
        }
    })();

    /**
     * CompositionGraph is an internal data structure that I use to keep track of composing constraints and the
     * relationships between them (composing constraints can contain other composing constraints). The main use of this
     * data structure is to identify cycles during composition. This can only happen during calls to regula.override.
     * Since cycles in the constraint-composition graph will lead to infinite loops, I need to detect them and throw
     * an exception.
     *
     * @type {{addNode: Function, getNodeByType: Function, cycleExists: Function, getRoot: Function, setRoot: Function, clone: Function}}
     */
    var CompositionGraph = {
        addNode: function (type, parent) {},
        getNodeByType: function (type) {},
        cycleExists: function (startNode) {},
        getRoot: function () {},
        setRoot: function (root) {},
        clone: function () {}
    };

    CompositionGraph = (function () {
        var typeToNodeMap = {};

        /* root is a special node that serves as the root of the composition tree/graph (works either way because a tree
           is a special case of a graph)
         */

        var root = {
            visited: false,
            name: "RootNode",
            type: -1,
            children: []
        };

        function addNode(type, parent) {
            var newNode = typeToNodeMap[type] == null ? {
                visited: false,
                name: ConstraintService.ReverseConstraint[type],
                type: type,
                children: []
            } : typeToNodeMap[type];

            if (parent == null) {
                root.children[root.children.length] = newNode;
            } else {
                parent.children[parent.children.length] = newNode;
            }

            typeToNodeMap[type] = newNode;
        }

        function clone() {
            return _clone(root);
        }

        function _clone(node) {
            var cloned = {
                visited: node.visited,
                name: node.name,
                type: node.type,
                children: []
            };

            for (var i = 0; i < node.children.length; i++) {
                cloned.children[cloned.children.length] = _clone(node.children[i]);
            }

            return cloned;
        }

        function getNodeByType(type) {
            return typeToNodeMap[type];
        }

        function cycleExists(startNode) {
            var result = (function (node, path) {

                var result = {
                    cycleExists: false,
                    path: path
                };

                if (node.visited) {
                    result = {
                        cycleExists: true,
                        path: path
                    };
                } else {
                    node.visited = true;

                    var i = 0;
                    while (i < node.children.length && !result.cycleExists) {
                        result = arguments.callee(node.children[i], path + "." + node.children[i].name);
                        i++;
                    }
                }

                return result;
            }(startNode, startNode.name));

            if (!result.cycleExists) {
                clearVisited();
            }

            return result;
        }

        function removeChildren(node) {
            node.children = [];
        }

        function clearVisited() {
            (function (node) {
                node.visited = false;
                for (var i = 0; i < node.children.length; i++) {
                    arguments.callee(node.children[i]);
                }
            }(root));
        }

        function getRoot() {
            return root;
        }

        function setRoot(newRoot) {
            root = newRoot;
        }

        return {
            addNode: addNode,
            removeChildren: removeChildren,
            getNodeByType: getNodeByType,
            cycleExists: cycleExists,
            getRoot: getRoot,
            setRoot: setRoot,
            clone: clone
        };
    })();

    /**
     * Encapsulates the logic that performs constraint validation.
     * @type {{Validator: {}, compoundValidator: Function, validate: Function, runValidatorFor: Function, interpolateConstraintDefaultMessage: Function}}
     */
    var ValidationService = {
        Validator: {},
        compoundValidator: function(params, currentGroup, compoundConstraint) {},
        validate: function(validationOptions) {},
        runValidatorFor: function(currentGroup, elementId, elementConstraint, params) {},
        interpolateConstraintDefaultMessage: function(elementId, elementConstraint, params) {}
    };

    ValidationService = (function() {

        var validatedConstraints = {}; //Keeps track of constraints that have already been validated for a validation run. Cleared out each time validation is run.
        var validatedRadioGroups = {}; //Keeps track of constraints that have already been validated for a validation run, on radio groups. Cleared out each time validation is run.

        /**
         * Validators that are used by regula to perform the actual validation. Will also contain references to custom and
         * compound constraints defined by the user.
         *
         * @type {{checked: Function, selected: Function, max: Function, min: Function, range: Function, notBlank: Function, blank: Function, matches: Function, email: Function, alpha: Function,
         *         numeric: Function, integer: Function, real: Function, alphaNumeric: Function, completelyFilled: Function, passwordsMatch: Function, required: Function, length: Function,
         *         digits: Function, past: Function, future: Function, html5Required: Function, html5Email: Function, html5URL: Function, html5Number: Function, html5DateTime: Function,
         *         html5DateTimeLocal: Function, html5Date: Function, html5Month: Function, html5Time: Function, html5Week: Function, html5Range: Function, html5Tel: Function,
         *         html5Color: Function, html5Pattern: Function, html5MaxLength: Function, html5Min: Function, html5Max: Function, html5Step: Function}}
         */
        var Validator = {

            checked: function(params) {
                var result = false;

                if (this.type.toLowerCase() === "radio" && this.name.replace(/\s/g, "") !== "") {
                    var elements = DOMUtils.getElementsByAttribute(document.body, "input", "name", this.name);

                    var i = 0;
                    while (i < elements.length && !result) {
                        result = elements[i].checked;
                        i++;
                    }

                } else {
                    result = this.checked;
                }

                return result;
            },

            selected: function(params) {
                return this.selectedIndex > 0;
            },

            max: function(params) {
                var result = true;

                if (shouldValidate(this, params)) {
                    result = (parseFloat(this.value) <= parseFloat(params["value"]));
                }

                return result;
            },

            min: function(params) {
                var result = true;

                if (shouldValidate(this, params)) {
                    result = (parseFloat(this.value) >= parseFloat(params["value"]));
                }

                return result;
            },

            range: function(params) {
                var result = true;

                if (shouldValidate(this, params)) {
                    result = (this.value.replace(/\s/g, "") != "" && parseFloat(this.value) <= parseFloat(params["max"]) && parseFloat(this.value) >= parseFloat(params["min"]));
                }

                return result;
            },

            notBlank: function(params) {
                return this.value.replace(/\s/g, "") != "";
            },

            blank: function(params) {
                return this.value.replace(/\s/g, "") === "";
            },

            matches: function(params) {
                var result = true;

                if (shouldValidate(this, params)) {
                    var re;

                    var regex;
                    if (typeof params["regex"] === "string") {
                        regex = params["regex"].replace(/^\//, "").replace(/\/$/, "")
                    } else {
                        regex = params["regex"];
                    }

                    if (typeof params["flags"] !== "undefined") {
                        re = new RegExp(regex.toString().replace(/^\//, "").replace(/\/[^\/]*$/, ""), params["flags"]);
                    } else {
                        re = new RegExp(regex);
                    }

                    result = re.test(this.value);
                }

                return result;
            },

            email: function(params) {
                var result = true;

                if (shouldValidate(this, params)) {
                    result = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i.test(this.value);
                }

                return result;
            },

            alpha: function(params) {
                var result = true;

                if (shouldValidate(this, params)) {
                    result = /^[A-Za-z]+$/.test(this.value);
                }

                return result;
            },

            numeric: function(params) {
                var result = true;

                if (shouldValidate(this, params)) {
                    result = /^[0-9]+$/.test(this.value);
                }

                return result;
            },

            integer: function(params) {
                var result = true;

                if (shouldValidate(this, params)) {
                    result = /^-?[0-9]+$/.test(this.value);
                }

                return result;
            },

            real: function(params) {
                var result = true;

                if (shouldValidate(this, params)) {
                    result = /^-?([0-9]+(\.[0-9]+)?|\.[0-9]+)$/.test(this.value);
                }

                return result;
            },

            alphaNumeric: function(params) {
                var result = true;

                if (shouldValidate(this, params)) {
                    result = /^[0-9A-Za-z]+$/.test(this.value);
                }

                return result;
            },

            completelyFilled: function(params) {
                var unfilledElements = [];

                for (var i = 0; i < this.elements.length; i++) {
                    var element = this.elements[i];

                    if (!Validator.required.call(element)) {
                        unfilledElements.push(element);
                    }
                }

                return unfilledElements;
            },

            passwordsMatch: function(params) {
                var failingElements = [];

                var passwordField1 = document.getElementById(params["field1"]);
                var passwordField2 = document.getElementById(params["field2"]);

                if (passwordField1.value != passwordField2.value) {
                    failingElements = [passwordField1, passwordField2];
                }

                return failingElements;
            },

            required: function(params) {
                var result = true;

                if (this.tagName) {
                    if (this.tagName.toLowerCase() === "select") {
                        result = Validator.selected.call(this);
                    } else if (this.type.toLowerCase() === "checkbox" || this.type.toLowerCase() === "radio") {
                        result = Validator.checked.call(this);
                    } else if (this.tagName.toLowerCase() === "input" || this.tagName.toLowerCase() === "textarea") {
                        if (this.type.toLowerCase() != "button") {
                            result = Validator.notBlank.call(this);
                        }
                    }
                }

                return result;
            },

            length: function(params) {
                var result = true;

                if(shouldValidate(this, params)) {
                   result = (this.value.length >= params["min"] && this.value.length <= params["max"]);
                }

                return result;
            },

            digits: function(params) {
                var result = true;

                if (shouldValidate(this, params)) {
                    var value = this.value.replace(/\s/g, "");
                    var parts = value.split(/\./);
                    result = false;

                    if (value.length > 0) {

                        if (parts.length == 1) {
                            parts[1] = "";
                        }

                        if (params["integer"] > 0) {
                            result = parts[0].length <= params["integer"];
                        } else {
                            result = true; //we don't care about the number of digits in the integer part
                        }

                        if (params["fraction"] > 0) {
                            result = result && parts[1].length <= params["fraction"];
                        }
                    }

                }

                return result;
            },

            past: function(params) {
                var result = true;

                if (shouldValidate(this, params)) {
                    var dates = parseDates.call(this, params);
                    result = (dates.dateToValidate < dates.dateToTestAgainst);
                }

                return result;
            },

            future: function(params) {
                var result = true;

                if (shouldValidate(this, params)) {
                    var dates = parseDates.call(this, params);
                    result = (dates.dateToValidate > dates.dateToTestAgainst);
                }

                return result;
            },

            html5Required: function(params) {
                return !this.validity.valueMissing;
            },
            html5Email: html5TypeValidator,
            html5URL: html5TypeValidator,
            html5Number: html5TypeValidator,
            html5DateTime: html5TypeValidator,
            html5DateTimeLocal: html5TypeValidator,
            html5Date: html5TypeValidator,
            html5Month: html5TypeValidator,
            html5Time: html5TypeValidator,
            html5Week: html5TypeValidator,
            html5Range: html5TypeValidator,
            html5Tel: html5TypeValidator,
            html5Color: html5TypeValidator,
            html5Pattern: function(params) {
                return !this.validity.patternMismatch;
            },

            html5MaxLength: function(params) {
                return !this.validity.tooLong;
            },

            html5Min: function(params) {
                return !this.validity.rangeUnderflow;
            },

            html5Max: function(params) {
                return !this.validity.rangeOverflow;
            },

            html5Step: function(params) {
                return !this.validity.stepMismatch;
            }
        };

        /**
         * This is a meta-validator that validates constraints inside a compound constraint.
         * @param params - parameters for the constraint
         * @param currentGroup - the group that is currently being validated
         * @param compoundConstraint - the constraint that is currently being validated
         * @return {Array} - an array of constraint violations
         */
        function compoundValidator(params, currentGroup, compoundConstraint) {
            //        console.log(params, currentGroup, compoundConstraint);
            var composingConstraints = compoundConstraint.composingConstraints;
            var constraintViolations = [];
            //        console.log("composing constraints", composingConstraints);
            for (var i = 0; i < composingConstraints.length; i++) {
                var composingConstraint = composingConstraints[i];
                var composingConstraintName = ConstraintService.ReverseConstraint[composingConstraint.constraintType];

                /*
                 Now we'll merge the parameters in the child constraints with the parameters from the parent
                 constraint
                 */

                var mergedParams = {};

                for (var paramName in composingConstraint.params) if (composingConstraint.params.hasOwnProperty(paramName) && paramName != "__size__") {
                    MapUtils.put(mergedParams, paramName, composingConstraint.params[paramName]);
                }

                /* we're only going to override if the compound constraint was defined with required params */
                if (compoundConstraint.params.length > 0) {
                    for (var paramName in params) if (params.hasOwnProperty(paramName) && paramName != "__size__") {
                        MapUtils.put(mergedParams, paramName, params[paramName]);
                    }
                }

                var validationResult = ValidationService.runValidatorFor(currentGroup, this.id, composingConstraintName, mergedParams);

                var errorMessage = "";
                if (!validationResult.constraintPassed) {
                    errorMessage = ValidationService.interpolateConstraintDefaultMessage(this.id, composingConstraintName, mergedParams);
                    var constraintViolation = {
                        group: currentGroup,
                        constraintName: composingConstraintName,
                        custom: ConstraintService.constraintDefinitions[composingConstraintName].custom,
                        compound: ConstraintService.constraintDefinitions[composingConstraintName].compound,
                        constraintParameters: composingConstraint.params,
                        failingElements: validationResult.failingElements,
                        message: errorMessage
                    };

                    if (!compoundConstraint.reportAsSingleViolation) {
                        constraintViolation.composingConstraintViolations = validationResult.composingConstraintViolations || [];
                    }

                    constraintViolations.push(constraintViolation);
                }
                //            console.log("finish validation");
                if (config.enableHTML5Validation) {
                    for (var j = 0; j < validationResult.failingElements.length; j++) {
                        validationResult.failingElements[j].setCustomValidity(errorMessage);
                    }
                }
            }

            return constraintViolations;
        }

        function shouldValidate(element, params) {
            var validateEmptyFields = config.validateEmptyFields;

            if (typeof params["ignoreEmpty"] !== "undefined") {
                validateEmptyFields = !params["ignoreEmpty"];
            }

            return !(Validator.blank.call(element) && !validateEmptyFields);
        }

        function parseDates(params) {
            var DateFormatIndices = {
                YMD: {
                    Year: 0,
                    Month: 1,
                    Day: 2
                },
                MDY: {
                    Month: 0,
                    Day: 1,
                    Year: 2
                },
                DMY: {
                    Day: 0,
                    Month: 1,
                    Year: 2
                }
            };

            var dateFormatIndices = DateFormatIndices[params["format"]];

            var separator = params["separator"];
            if (typeof params["separator"] === "undefined") {
                separator = /\//.test(this.value) ? "/" : /\./.test(this.value) ? "." : / /.test(this.value) ? " " : /[^0-9]+/;
            }

            var parts = this.value.split(separator);
            var dateToValidate = new Date(parts[dateFormatIndices.Year], parts[dateFormatIndices.Month] - 1, parts[dateFormatIndices.Day]);

            var dateToTestAgainst = new Date();
            if (typeof params["date"] !== "undefined") {
                parts = params["date"].split(separator);
                dateToTestAgainst = new Date(parts[dateFormatIndices.Year], parts[dateFormatIndices.Month] - 1, parts[dateFormatIndices.Day]);
            }

            return {
                dateToValidate: dateToValidate,
                dateToTestAgainst: dateToTestAgainst
            };
        }

        /**
         * This specific function is used by HTML5 constraints that essentially perform type-validation (e.g., type="url", type="email", etc.).
         * Individual entries within Validator that perform type-specific validation (like HTML5Email) will point to this function.
         * @return {Boolean}
         */
        function html5TypeValidator() {
            return !this.validity.typeMismatch;
        }

        function validate(options) {

            validatedConstraints = {}; //clear these out on every run
            validatedRadioGroups = {}; //clear these out on every run

            //generates a key that can be used with the function table to call the correct auxiliary validator function
            //(see below for more details)
            function generateKey(options) {
                var groups = options.groups || null;
                var elementId = options.elementId || null;
                var constraintType = (typeof options.constraintType === "undefined" ? null : options.constraintType) || null;
                var key = "";
                key += (groups == null) ? "0" : "1";
                key += (elementId == null) ? "0" : "1";
                key += (constraintType == null) ? "0" : "1";
                return key;
            }

            //Instead of having a bunch of if-elses, I'm creating a function table that maps the combination of parameters
            //that this function can receive (in its options parameters) to the auxiliary (helper) functions. The key consists
            //of three "bits". The first bit represents whether the options.groups parameter is null (0 for null 1 for not null).
            //The second bit represents whether the options.elementId parameter is null, and the third bit represents whether the
            //options.constraintType parameter is null.
            var functionTable = {
                "000": validateAll,
                "001": validateConstraint,
                "010": validateElement,
                "011": validateElementWithConstraint,
                "100": validateGroups,
                "101": validateGroupsWithConstraint,
                "110": validateGroupsWithElement,
                "111": validateGroupsElementWithConstraint
            };

            //if no arguments were passed in, we initialize options to an empty map
            if (!options || typeof options === "undefined") {
                options = {};
            }

            /* default to independent validation for groups i.e., groups are validated independent of each other and will not
             fail early
             */
            if (typeof options.independent === "undefined") {
                options.independent = true;
            }

            //Get the actual constraint name
            if (typeof options.constraintType !== "undefined") {
                options.constraintType = ConstraintService.ReverseConstraint[options.constraintType];
            }

            //Get the actual group name
            if (options.groups) {

                //We're going to create a new array and assign that to options.groups. This array will contain the actual group
                //names of the groups. The reason we do this is because in validate() we store a reference to the original groups
                //array. If we didn't copy this over, we would be modifying that original array.
                var groups = options.groups;
                options.groups = [];

                for (var i = 0; i < groups.length; i++) {
                    options.groups.push(GroupService.ReverseGroup[groups[i]]);
                }
            }

            return functionTable[generateKey(options)](options);
        }

        function validateAll() {
            var constraintViolations = [];

            //console.log("BoundConstraints", BindingService.getBoundConstraints());

            for (var group in BindingService.getBoundConstraints()) if (BindingService.getBoundConstraints().hasOwnProperty(group)) {

                var groupElements = BindingService.getBoundConstraints()[group];

                for (var elementId in groupElements) if (groupElements.hasOwnProperty(elementId)) {

                    if (!document.getElementById(elementId)) {
                        //if the element no longer exists, remove it from the bindings and continue
                        delete groupElements[elementId];
                    } else {
                        var elementConstraints = groupElements[elementId];

                        for (var elementConstraint in elementConstraints) if (elementConstraints.hasOwnProperty(elementConstraint)) {

                            var constraintViolation = validateGroupElementConstraintCombination(group, elementId, elementConstraint);

                            if (constraintViolation) {
                                constraintViolations.push(constraintViolation);
                            }
                        }
                    }
                }
            }

            return constraintViolations;
        }

        function validateConstraint(options) {
            var constraintViolations = [];
            var constraintFound = false;

            for (var group in BindingService.getBoundConstraints()) if (BindingService.getBoundConstraints().hasOwnProperty(group)) {

                var groupElements = BindingService.getBoundConstraints()[group];

                for (var elementId in groupElements) if (groupElements.hasOwnProperty(elementId)) {

                    var elementConstraints = groupElements[elementId];

                    if (elementConstraints[options.constraintType]) {
                        constraintFound = true;
                        var constraintViolation = validateGroupElementConstraintCombination(group, elementId, options.constraintType);

                        if (constraintViolation) {
                            constraintViolations.push(constraintViolation);
                        }
                    }
                }
            }

            //We want to let the user know if they used a constraint that has not been defined anywhere. Otherwise, this
            //function returns zero validation results, which can be (incorrectly) interpreted as a successful validation
            if (!constraintFound) {
                throw new ExceptionService.Exception.IllegalArgumentException("Constraint " + options.constraintType + " has not been bound to any element. " + ExceptionService.explodeParameters(options));
            }

            return constraintViolations;
        }

        function validateElement(options) {
            var constraintViolations = [];
            var elementFound = false;

            for (var group in BindingService.getBoundConstraints()) if (BindingService.getBoundConstraints().hasOwnProperty(group)) {

                var groupElements = BindingService.getBoundConstraints()[group];

                if (groupElements[options.elementId]) {
                    elementFound = true;
                    var elementConstraints = groupElements[options.elementId];

                    for (var elementConstraint in elementConstraints) if (elementConstraints.hasOwnProperty(elementConstraint)) {

                        var constraintViolation = validateGroupElementConstraintCombination(group, options.elementId, elementConstraint);

                        if (constraintViolation) {
                            constraintViolations.push(constraintViolation);
                        }
                    }
                }
            }

            //We want to let the user know if they use an element that does not have any element bound to it. Otherwise, this
            //function returns zero results, which can be (incorrectly) interpreted as a successful validation

            if (!elementFound) {
                throw new ExceptionService.Exception.IllegalArgumentException("No constraints have been bound to element with id " + options.elementId + ". " + ExceptionService.explodeParameters(options));
            }

            return constraintViolations;
        }

        function validateElementWithConstraint(options) {
            var constraintViolations = [];
            var elementFound = false;
            var constraintFound = false;

            for (var group in BindingService.getBoundConstraints()) if (BindingService.getBoundConstraints().hasOwnProperty(group)) {

                var groupElements = BindingService.getBoundConstraints()[group];
                var elementConstraints = groupElements[options.elementId];

                if (elementConstraints) {
                    elementFound = true;

                    if (elementConstraints[options.constraintType]) {
                        constraintFound = true;

                        var constraintViolation = validateGroupElementConstraintCombination(group, options.elementId, options.constraintType);

                        if (constraintViolation) {
                            constraintViolations.push(constraintViolation);
                        }
                    }
                }
            }

            if (!elementFound || !constraintFound) {
                throw new ExceptionService.Exception.IllegalArgumentException("No element with id " + options.elementId + " was found with the constraint " + options.constraintType + " bound to it. " + ExceptionService.explodeParameters(options));
            }

            return constraintViolations;
        }

        function validateGroups(options) {
            var constraintViolations = [];

            var i = 0;
            var successful = true;
            while (i < options.groups.length && successful) {
                var group = options.groups[i];

                var groupElements = BindingService.getBoundConstraints()[group];
                if (groupElements) {

                    for (var elementId in groupElements) if (groupElements.hasOwnProperty(elementId)) {

                        var elementConstraints = groupElements[elementId];

                        for (var elementConstraint in elementConstraints) if (elementConstraints.hasOwnProperty(elementConstraint)) {

                            var constraintViolation = validateGroupElementConstraintCombination(group, elementId, elementConstraint);

                            if (constraintViolation) {
                                constraintViolations.push(constraintViolation);
                            }
                        }
                    }
                } else {
                    throw new ExceptionService.Exception.IllegalArgumentException("Undefined group in group list. " + ExceptionService.explodeParameters(options));
                }

                i++;
                successful = (constraintViolations.length == 0) || (options.independent && constraintViolations.length != 0);
            }

            return constraintViolations;
        }

        function validateGroupsWithConstraint(options) {
            var constraintViolations = [];

            var i = 0;
            var successful = true;
            while (i < options.groups.length && successful) {
                var group = options.groups[i];

                var groupElements = BindingService.getBoundConstraints()[group];
                if (groupElements) {
                    var constraintFound = false;

                    for (var elementId in groupElements) if (groupElements.hasOwnProperty(elementId)) {

                        var elementConstraints = groupElements[elementId];

                        if (elementConstraints[options.constraintType]) {
                            constraintFound = true;
                            var constraintViolation = validateGroupElementConstraintCombination(group, elementId, options.constraintType);

                            if (constraintViolation) {
                                constraintViolations.push(constraintViolation);
                            }
                        }
                    }

                    //We want to let the user know if they used a constraint that has not been defined anywhere. Otherwise, this
                    //function can return zero validation results, which can be (incorrectly) interpreted as a successful validation

                    if (!constraintFound) {
                        throw new ExceptionService.Exception.IllegalArgumentException("Constraint " + options.constraintType + " has not been bound to any element under group " + group + ". " + ExceptionService.explodeParameters(options));
                    }
                } else {
                    throw new ExceptionService.Exception.IllegalArgumentException("Undefined group in group list. " + ExceptionService.explodeParameters(options));
                }

                i++;
                successful = (constraintViolations.length == 0) || (options.independent && constraintViolations.length != 0);
            }

            return constraintViolations;
        }

        function validateGroupsWithElement(options) {
            var constraintViolations = [];
            var notFound = [];

            var i = 0;
            var successful = true;
            while (i < options.groups.length && successful) {
                var group = options.groups[i];

                var groupElements = BindingService.getBoundConstraints()[group];
                if (groupElements) {

                    var elementConstraints = groupElements[options.elementId];

                    if (elementConstraints) {
                        for (var elementConstraint in elementConstraints) if (elementConstraints.hasOwnProperty(elementConstraint)) {

                            var constraintViolation = validateGroupElementConstraintCombination(group, options.elementId, elementConstraint);

                            if (constraintViolation) {
                                constraintViolations.push(constraintViolation);
                            }
                        }
                    } else {
                        notFound.push(group);
                    }
                } else {
                    throw new ExceptionService.Exception.IllegalArgumentException("Undefined group in group list. " + ExceptionService.explodeParameters(options));
                }

                i++;
                successful = (constraintViolations.length == 0) || (options.independent && constraintViolations.length != 0);
            }

            if (notFound.length > 0) {
                throw new ExceptionService.Exception.IllegalArgumentException("No element with id " + options.elementId + " was found in the following group(s): )[" + ArrayUtils.explode(notFound, ",").replace(/,/g, ", ") + "]. " + ExceptionService.explodeParameters(options));
            }

            return constraintViolations;
        }

        function validateGroupsElementWithConstraint(options) {
            var constraintViolations = [];

            var i = 0;
            var successful = true;
            while (i < options.groups.length && successful) {
                var group = options.groups[i];
                var constraintViolation = validateGroupElementConstraintCombination(group, options.elementId, options.constraintType);

                if (constraintViolation) {
                    constraintViolations.push(constraintViolation);
                }

                i++;
                successful = (constraintViolations.length == 0) || (options.independent && constraintViolations.length != 0);
            }

            return constraintViolations;
        }

        function validateGroupElementConstraintCombination(group, elementId, elementConstraint) {
            //console.log(group, elementId, elementConstraint);
            var constraintViolation;
            var groupElements = BindingService.getBoundConstraints()[group];

            if (!groupElements) {
                throw new ExceptionService.Exception.IllegalArgumentException("Undefined group in group list (group: " + group + ", elementId: " + elementId + ", constraint: " + elementConstraint + ")");
            }

            var elementConstraints = groupElements[elementId];

            if (!validatedConstraints[elementId]) {
                validatedConstraints[elementId] = {};
            }

            var element = document.getElementById(elementId);
            var name = element.name.replace(/\s/g, "");

            if (typeof element.type !== "undefined" && element.type.toLowerCase() === "radio" && name !== "") {
                if (!validatedRadioGroups[name]) {
                    validatedRadioGroups[name] = {};
                }
            } else {
                name = "__dontcare__";
                validatedRadioGroups[name] = {}; //we really don't care about this if what we're looking at is not a radio button
            }

            //Validate this constraint only if we haven't already validated it during this validation run
            if (!validatedConstraints[elementId][elementConstraint] && !validatedRadioGroups[name][elementConstraint]) {
                if (!elementConstraints) {
                    throw new ExceptionService.Exception.IllegalArgumentException("No constraints have been defined for the element with id: " + elementId + " in group " + group);
                } else {
                    var params = elementConstraints[elementConstraint];

                    if (!params) {
                        throw new ExceptionService.Exception.IllegalArgumentException(elementConstraint + " in group " + group + " hasn't been bound to the element with id " + elementId);
                    } else {
                        //console.log("Going to run validator for:", group, elementId, elementConstraint, params);
                        var validationResult = runValidatorFor(group, elementId, elementConstraint, params);

                        var errorMessage = "";
                        if (!validationResult.constraintPassed) {
                            errorMessage = interpolateConstraintDefaultMessage(elementId, elementConstraint, params);

                            constraintViolation = {
                                group: group,
                                constraintName: elementConstraint,
                                formSpecific: ConstraintService.constraintDefinitions[elementConstraint].formSpecific,
                                custom: ConstraintService.constraintDefinitions[elementConstraint].custom,
                                compound: ConstraintService.constraintDefinitions[elementConstraint].compound,
                                composingConstraintViolations: validationResult.composingConstraintViolations || [],
                                constraintParameters: params,
                                failingElements: validationResult.failingElements,
                                message: errorMessage
                            };
                        }

                        if (config.enableHTML5Validation) {
                            for (var i = 0; i < validationResult.failingElements.length; i++) {
                                validationResult.failingElements[i].setCustomValidity("");
                            }
                        }
                    }
                }
            }

            return constraintViolation;
        }

        function runValidatorFor(currentGroup, elementId, elementConstraint, params) {
            var constraintPassed = false;
            var failingElements = [];
            var element = document.getElementById(elementId);
            var composingConstraintViolations = [];

            if (ConstraintService.constraintDefinitions[elementConstraint].formSpecific) {
                failingElements = ConstraintService.constraintDefinitions[elementConstraint].validator.call(element, params);
                constraintPassed = failingElements.length == 0;
            } else if (ConstraintService.constraintDefinitions[elementConstraint].compound) {
                //            console.log("is compound");
                composingConstraintViolations = ConstraintService.constraintDefinitions[elementConstraint].validator.call(element, params, currentGroup, ConstraintService.constraintDefinitions[elementConstraint]);
                constraintPassed = composingConstraintViolations.length == 0;

                if (!constraintPassed) {
                    failingElements.push(element);
                }
            } else {
                constraintPassed = ConstraintService.constraintDefinitions[elementConstraint].validator.call(element, params);

                if (!constraintPassed) {
                    failingElements.push(element)
                }
            }

            validatedConstraints[elementId][elementConstraint] = true; //mark this element constraint as validated

            var name = element.name.replace(/\s/g, "");
            if (typeof element.type !== "undefined" && element.type.toLowerCase() === "radio" && name !== "") {
                validatedRadioGroups[name][elementConstraint] = true; //mark this radio group as validated
                failingElements = DOMUtils.getElementsByAttribute(document.body, "input", "name", name); //let's set failing elements to all elements of the radio group
            }

            var validationResult = {
                constraintPassed: constraintPassed,
                failingElements: failingElements
            };

            if (!ConstraintService.constraintDefinitions[elementConstraint].reportAsSingleViolation) {
                validationResult.composingConstraintViolations = composingConstraintViolations;
            }

            return validationResult;
        }

        function interpolateConstraintDefaultMessage(elementId, elementConstraint, params) {
            var element = document.getElementById(elementId);
            var errorMessage = "";

            if (params["message"]) {
                errorMessage = params["message"];
            } else if (params["msg"]) {
                errorMessage = params["msg"];
            } else {
                errorMessage = ConstraintService.constraintDefinitions[elementConstraint].defaultMessage;
            }

            for (var param in params) if (params.hasOwnProperty(param)) {
                var re = new RegExp("{" + param + "}", "g");
                errorMessage = errorMessage.replace(re, params[param]);
            }

            //If this is a compound constraint, we need to look at the parameters on each composing constraint so that we can interpolate their values
            if (ConstraintService.constraintDefinitions[elementConstraint].compound && typeof ConstraintService.constraintDefinitions[elementConstraint].composingConstraints !== "undefined") {
                for (var i = 0; i < ConstraintService.constraintDefinitions[elementConstraint].composingConstraints.length; i++) {
                    var composingConstraint = ConstraintService.constraintDefinitions[elementConstraint].composingConstraints[i];

                    for (var param in composingConstraint.params) if (composingConstraint.params.hasOwnProperty(param)) {

                        var re = new RegExp("{" + param + "}", "g");
                        errorMessage = errorMessage.replace(re, composingConstraint.params[param]);
                    }
                }
            }

            if (/{label}/.test(errorMessage)) {
                var friendlyInputName = DOMUtils.friendlyInputNames[element.tagName.toLowerCase()];

                if (!friendlyInputName) {
                    friendlyInputName = DOMUtils.friendlyInputNames[element.type.toLowerCase()];
                }

                errorMessage = errorMessage.replace(/{label}/, friendlyInputName);

                //Some optional parameters appear in the error messages of default constraints. These need to be replaced
                errorMessage = errorMessage.replace(/{flags}/g, "");
            }

            //not sure if this is just a hack or not. But I'm trying to replace doubly-escaped quotes. This
            //usually happens if the data-constraints attribute is surrounded by double quotes instead of
            //single quotes
            errorMessage = errorMessage.replace(/\\\"/g, "\"");

            return errorMessage;
        }

        return {
            Validator: Validator,
            compoundValidator: compoundValidator,
            validate: validate,
            runValidatorFor: runValidatorFor,
            interpolateConstraintDefaultMessage: interpolateConstraintDefaultMessage
        };
    })();

    /**
     * Defines the actual constraints that regula supports, and also maintains reverse-mapping between numeric constraint-values
     * and their String equivalents (for example, Checked can be mapped to 0, and 0 is reverse-mapped to Checked).
     *
     * This module also contains a few functions related to the validation of constraint definitions and constraint parameters.
     *
     * @type {{Constraint: {}, ReverseConstraint: {}, firstCustomConstraintIndex: number, constraintDefinitions: {}, verifyConstraintDefinition: Function, verifyParameterCountMatch: Function}}
     */
    var ConstraintService = {
        Constraint: {},
        ReverseConstraint: {},
        firstCustomConstraintIndex: 0,
        constraintDefinitions: {},
        override: function(options) {},
        custom: function(options) {},
        compound: function(options) {},
        verifyConstraintDefinition: function(element, constraintName, definedParameters) {},
        verifyParameterCountMatch: function(element, constraint, receivedParameters) {}
    };

    ConstraintService = (function() {

        var Constraint = {};
        var ReverseConstraint = {};
        var firstCustomConstraintIndex = 0;

        /**
         * The Constraint and ReverseConstraint "enums" are generated here. This is a self-invoked function that iterates
         * over an array of strings that correspond to constraint names. Using these values, it creates entries in the
         * Constraint and ReverseConstraint maps. In addition, it also sets the value for firstCustomConstraintIndex.
         */
        (function(constraints) {
            for(var i = 0; i < constraints.length; i++) {
                Constraint[constraints[i]] = i;
                ReverseConstraint[i] = constraints[i];
            }

            firstCustomConstraintIndex = i;

            /*
            Set up aliases
             */

            Constraint["Between"] = Constraint.Range;
            Constraint["Matches"] = Constraint.Pattern;
            Constraint["Empty"] = Constraint.Blank;
            Constraint["NotEmpty"] = Constraint.NotBlank;
            Constraint["IsAlpha"] = Constraint.Alpha;
            Constraint["IsNumeric"] = Constraint.Numeric;
            Constraint["IsAlphaNumeric"] = Constraint.AlphaNumeric;
        })([
            "Checked",
            "Selected",
            "Max",
            "Min",
            "Range",
            "Between",
            "NotBlank",
            "NotEmpty",
            "Blank",
            "Empty",
            "Pattern",
            "Matches",
            "Email",
            "Alpha",
            "IsAlpha",
            "Numeric",
            "IsNumeric",
            "AlphaNumeric",
            "IsAlphaNumeric",
            "Integer",
            "Real",
            "CompletelyFilled",
            "PasswordsMatch",
            "Required",
            "Length",
            "Digits",
            "Past",
            "Future",
            "Step",
            "URL",
            "HTML5Required",
            "HTML5Email",
            "HTML5URL",
            "HTML5Number",
            "HTML5DateTime",
            "HTML5DateTimeLocal",
            "HTML5Date",
            "HTML5Month",
            "HTML5Time",
            "HTML5Week",
            "HTML5Range",
            "HTML5Tel",
            "HTML5Color",
            "HTML5Pattern",
            "HTML5MaxLength",
            "HTML5Min",
            "HTML5Max",
            "HTML5Step"
        ]);

        var constraintDefinitions = {
            Checked: {
                html5: false,
                formSpecific: false,
                validator: ValidationService.Validator.checked,
                constraintType: Constraint.Checked,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} debe estar marcado."
            },

            Selected: {
                html5: false,
                formSpecific: false,
                validator: ValidationService.Validator.selected,
                constraintType: Constraint.Selected,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} debe estar seleccionado."
            },

            Max: {
                html5: false,
                formSpecific: false,
                validator: ValidationService.Validator.max,
                constraintType: Constraint.Max,
                custom: false,
                compound: false,
                params: ["value"],
                defaultMessage: "{label} debe ser menor o igual a {value}."
            },

            Min: {
                html5: false,
                formSpecific: false,
                validator: ValidationService.Validator.min,
                constraintType: Constraint.Min,
                custom: false,
                compound: false,
                params: ["value"],
                defaultMessage: "{label} debe ser mayor o igual a {value}."
            },

            Range: {
                html5: false,
                formSpecific: false,
                validator: ValidationService.Validator.range,
                constraintType: Constraint.Range,
                custom: false,
                compound: false,
                params: ["min", "max"],
                defaultMessage: "{label} debe estar entre {min} y {max}."
            },

            NotBlank: {
                html5: false,
                formSpecific: false,
                validator: ValidationService.Validator.notBlank,
                constraintType: Constraint.NotBlank,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} no puede estar vacío."
            },

            Blank: {
                html5: false,
                formSpecific: false,
                validator: ValidationService.Validator.blank,
                constraintType: Constraint.Blank,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} debe estar vacío."
            },

            Pattern: {
                html5: false,
                formSpecific: false,
                validator: ValidationService.Validator.matches,
                constraintType: Constraint.Pattern,
                custom: false,
                compound: false,
                params: ["regex"],
                defaultMessage: "{label} debe seguir la expresión {regex}{flags}."
            },

            Email: {
                html5: false,
                formSpecific: false,
                validator: ValidationService.Validator.email,
                constraintType: Constraint.Email,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} no es un correo electrónico válido."
            },

            Alpha: {
                html5: false,
                formSpecific: false,
                validator: ValidationService.Validator.alpha,
                constraintType: Constraint.Alpha,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} solo puede contener letras."
            },

            Numeric: {
                html5: false,
                formSpecific: false,
                validator: ValidationService.Validator.numeric,
                constraintType: Constraint.Numeric,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} solo puede contener números."
            },

            AlphaNumeric: {
                html5: false,
                formSpecific: false,
                validator: ValidationService.Validator.alphaNumeric,
                constraintType: Constraint.AlphaNumeric,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} solo puede contener letras y números."
            },

            Integer: {
                html5: false,
                formSpecific: false,
                validator: ValidationService.Validator.integer,
                constraintType: Constraint.Integer,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} debe ser un número entero."
            },

            Real: {
                html5: false,
                formSpecific: false,
                validator: ValidationService.Validator.real,
                constraintType: Constraint.Real,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} debe ser un número real."
            },

            CompletelyFilled: {
                html5: false,
                formSpecific: true,
                validator: ValidationService.Validator.completelyFilled,
                constraintType: Constraint.CompletelyFilled,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} debe estar completamente lleno."
            },

            PasswordsMatch: {
                html5: false,
                formSpecific: true,
                validator: ValidationService.Validator.passwordsMatch,
                constraintType: Constraint.PasswordsMatch,
                custom: false,
                compound: false,
                params: ["field1", "field2"],
                defaultMessage: "La contraseña no es la misma."
            },

            Required: {
                html5: false,
                formSpecific: false,
                validator: ValidationService.Validator.required,
                constraintType: Constraint.Required,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} es requerido."
            },

            Length: {
                html5: false,
                formSpecific: false,
                validator: ValidationService.Validator.length,
                constraintType: Constraint.Length,
                custom: false,
                compound: false,
                params: ["min", "max"],
                defaultMessage: "{label} debe tener una longitud entre {min} y {max}."
            },

            Digits: {
                html5: false,
                formSpecific: false,
                validator: ValidationService.Validator.digits,
                constraintType: Constraint.Digits,
                custom: false,
                compound: false,
                params: ["integer", "fraction"],
                defaultMessage: "{label} must have up to {integer} digits and {fraction} fractional digits."
            },

            Past: {
                html5: false,
                formSpecific: false,
                validator: ValidationService.Validator.past,
                constraintType: Constraint.Past,
                custom: false,
                compound: false,
                params: ["format"],
                defaultMessage: "{label} must be in the past."
            },

            Future: {
                html5: false,
                formSpecific: false,
                validator: ValidationService.Validator.future,
                constraintType: Constraint.Future,
                custom: false,
                compound: false,
                params: ["format"],
                defaultMessage: "{label} must be in the future."
            },

            Step: {
                /* TODO:  implement */
                html5: false,
                formSpecific: false,
                constraintType: Constraint.Step,
                custom: false,
                compound: false,
                params: ["min", "value"],
                defaultMessage: "{label} must be equal to {min} or greater at increments of {value}."
            },

            URL: {
                /* TODO: implement */
                html5: false,
                formSpecific: false,
                constraintType: Constraint.URL,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} must be a valid URL."
            },

            HTML5Required: {
                html5: true,
                inputType: null,
                attribute: "required",
                formSpecific: false,
                validator: ValidationService.Validator.html5Required,
                constraintType: Constraint.HTML5Required,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} is required."
            },

            HTML5Email: {
                html5: true,
                inputType: "email",
                attribute: null,
                formSpecific: false,
                validator: ValidationService.Validator.html5Email,
                constraintType: Constraint.HTML5Email,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} is not a valid email."
            },

            HTML5Pattern: {
                html5: true,
                inputType: null,
                attribute: "pattern",
                formSpecific: false,
                validator: ValidationService.Validator.html5Pattern,
                constraintType: Constraint.HTML5Pattern,
                custom: false,
                compound: false,
                params: ["pattern"],
                defaultMessage: "{label} needs to match {pattern}."
            },

            HTML5URL: {
                html5: true,
                inputType: "url",
                attribute: null,
                formSpecific: false,
                validator: ValidationService.Validator.html5URL,
                constraintType: Constraint.HTML5URL,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} is not a valid URL."
            },

            HTML5Number: {
                html5: true,
                inputType: "number",
                attribute: null,
                formSpecific: false,
                validator: ValidationService.Validator.html5Number,
                constraintType: Constraint.HTML5Number,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} is not a valid number."
            },

            HTML5DateTime: {
                html5: true,
                inputType: "datetime",
                attribute: null,
                formSpecific: false,
                validator: ValidationService.Validator.html5DateTime,
                constraintType: Constraint.HTML5DateTime,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} is not a valid date-time."
            },

            HTML5DateTimeLocal: {
                html5: true,
                inputType: "datetime-local",
                attribute: null,
                formSpecific: false,
                validator: ValidationService.Validator.html5DateTimeLocal,
                constraintType: Constraint.HTML5DateTimeLocal,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} is not a valid local date-time."
            },

            HTML5Date: {
                html5: true,
                inputType: "date",
                attribute: null,
                formSpecific: false,
                validator: ValidationService.Validator.html5Date,
                constraintType: Constraint.HTML5Date,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} is not a valid date."
            },

            HTML5Month: {
                html5: true,
                inputType: "month",
                attribute: null,
                formSpecific: false,
                validator: ValidationService.Validator.html5Month,
                constraintType: Constraint.HTML5Month,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} is not a valid month."
            },

            HTML5Time: {
                html5: true,
                inputType: "time",
                attribute: null,
                formSpecific: false,
                validator: ValidationService.Validator.html5Time,
                constraintType: Constraint.HTML5Time,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} is not a valid time."
            },

            HTML5Week: {
                html5: true,
                inputType: "week",
                attribute: null,
                formSpecific: false,
                validator: ValidationService.Validator.html5Week,
                constraintType: Constraint.HTML5Week,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} is not a valid week."
            },

            HTML5Range: {
                html5: true,
                inputType: "range",
                attribute: null,
                formSpecific: false,
                validator: ValidationService.Validator.html5Range,
                constraintType: Constraint.HTML5Range,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} is not a valid range."
            },

            HTML5Tel: {
                html5: true,
                inputType: "tel",
                attribute: null,
                formSpecific: false,
                validator: ValidationService.Validator.html5Tel,
                constraintType: Constraint.HTML5Tel,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} is not a valid telephone number."
            },

            HTML5Color: {
                html5: true,
                inputType: "color",
                attribute: null,
                formSpecific: false,
                validator: ValidationService.Validator.html5Color,
                constraintType: Constraint.HTML5Color,
                custom: false,
                compound: false,
                params: [],
                defaultMessage: "{label} is not a valid color."
            },

            HTML5MaxLength: {
                html5: true,
                inputType: null,
                attribute: "maxlength",
                formSpecific: false,
                validator: ValidationService.Validator.html5MaxLength,
                constraintType: Constraint.HTML5MaxLength,
                custom: false,
                compound: false,
                params: ["maxlength"],
                defaultMessage: "{label} must be less than {maxlength} characters."
            },

            HTML5Min: {
                html5: true,
                inputType: null,
                attribute: "min",
                formSpecific: false,
                validator: ValidationService.Validator.html5Min,
                constraintType: Constraint.HTML5Min,
                custom: false,
                compound: false,
                params: ["min"],
                defaultMessage: "{label} needs to be greater than or equal to {min}."
            },

            HTML5Max: {
                html5: true,
                inputType: null,
                attribute: "max",
                formSpecific: false,
                validator: ValidationService.Validator.html5Max,
                constraintType: Constraint.HTML5Max,
                custom: false,
                compound: false,
                params: ["max"],
                defaultMessage: "{label} must be greater than or equal to {max}."
            },

            HTML5Step: {
                html5: true,
                inputType: null,
                attribute: "step",
                formSpecific: false,
                validator: ValidationService.Validator.html5Step,
                constraintType: Constraint.HTML5Step,
                custom: false,
                compound: false,
                params: ["step"],
                defaultMessage: "{label} must be equal to {min} or greater at increments of {value}."
            }
        };

        /**
         * Overrides the definition of a constraint. If the constraint is a compound constraint, then this function also
         * checks to make sure that there are no cycles in the composition graph.
         * @param options
         */
        function override(options) {
            if (options.compound) {
                verifyComposingConstraints(options.name, options.composingConstraints, options.params);

                /* Typically a user should fix their code when they see a cyclical-composition error from regula.override().
                 * If the error is ignored and validation is carried out however, we can get into an infinite loop because we
                 * modified the graph to contain a cycle. A more robust solution would be to clone the composition graph and
                 * restore it if we find out that it contains a cycle
                 */
                var root = CompositionGraph.clone();

                /* now let's update our graph */
                updateCompositionGraph(options.name, options.composingConstraints);

                /* we need to see if a cycle exists in our graph */
                var result = CompositionGraph.cycleExists(CompositionGraph.getNodeByType(options.constraintType));
                if (result.cycleExists) {
                    CompositionGraph.setRoot(root);
                    throw new ExceptionService.Exception.ConstraintDefinitionException("regula.override: The overriding composing-constraints you have specified have created a cyclic composition: " + result.path);
                }
            }

            ConstraintService.constraintDefinitions[options.name] = {
                formSpecific: options.formSpecific,
                constraintType: Constraint[options.name],
                custom: true,
                compound: options.compound,
                params: options.params,
                composingConstraints: options.composingConstraints,
                defaultMessage: options.defaultMessage,
                validator: options.validator
            };
        }

        /**
         * Adds a custom constraint
         * @param options
         */
        function custom(options) {
            //console.log("custom got", options);
            Constraint[options.name] = firstCustomConstraintIndex;
            ReverseConstraint[firstCustomConstraintIndex++] = options.name;
            constraintDefinitions[options.name] = {
                formSpecific: options.formSpecific,
                validator: options.validator,
                constraintType: Constraint[options.name],
                custom: true,
                compound: false,
                params: options.params,
                defaultMessage: options.defaultMessage
            };
            //console.log(Constraint);
        }

        /**
         * Adds a compound constraint
         * @param options
         */
        function compound(options) {
            verifyComposingConstraints(options.name, options.constraints, options.params);

            Constraint[options.name] = firstCustomConstraintIndex;
            ReverseConstraint[firstCustomConstraintIndex++] = options.name;
            constraintDefinitions[options.name] = {
                formSpecific: options.formSpecific,
                constraintType: Constraint[options.name],
                custom: true,
                compound: true,
                params: options.params,
                reportAsSingleViolation: options.reportAsSingleViolation,
                composingConstraints: options.constraints,
                defaultMessage: options.defaultMessage,
                validator: ValidationService.compoundValidator
            };

            /* now let's update our graph */
            updateCompositionGraph(options.name, options.constraints);
        }

        /**
         * Verifies a constraint definition. Ensures the following:
         *
         *  o Constraint is bound to an element that supports it.
         *  o Ensures that all parameters are present (by calling an auxiliary function)
         *
         * @param element - The element on which the constraint has been defined.
         * @param constraintName - The constraint in question.
         * @param definedParameters - The parameters that this constraint has received.
         * @returns {{successful: boolean, message: string, data: null}}
         */
        function verifyConstraintDefinition(element, constraintName, definedParameters) {
            var result = {
                successful: true,
                message: "",
                data: null
            };

            if (element.tagName.toLowerCase() == "form" && !ConstraintService.constraintDefinitions[constraintName].formSpecific) {
                result = {
                    successful: false,
                    message: ExceptionService.generateExceptionMessage(element, constraintName, "@" + constraintName + " is not a form constraint, but you are trying to bind it to a form"),
                    data: null
                };
            } else if (element.tagName.toLowerCase() != "form" && ConstraintService.constraintDefinitions[constraintName].formSpecific) {
                result = {
                    successful: false,
                    message: ExceptionService.generateExceptionMessage(element, constraintName, "@" + constraintName + " is a form constraint, but you are trying to bind it to a non-form element"),
                    data: null
                };
            } else if ((typeof element.type === "undefined" || (element.type.toLowerCase() != "checkbox" && element.type.toLowerCase() != "radio")) && constraintName == "Checked") {
                result = {
                    successful: false,
                    message: ExceptionService.generateExceptionMessage(element, constraintName, "@" + constraintName + " is only applicable to checkboxes and radio buttons. You are trying to bind it to an input element that is neither a checkbox nor a radio button."),
                    data: null
                };
            } else if (element.tagName.toLowerCase() != "select" && constraintName == "Selected") {
                result = {
                    successful: false,
                    message: ExceptionService.generateExceptionMessage(element, constraintName, "@" + constraintName + " is only applicable to select boxes. You are trying to bind it to an input element that is not a select box."),
                    data: null
                };
            } else {
                var parameterResult = verifyParameterCountMatches(element, ConstraintService.constraintDefinitions[constraintName], definedParameters);

                if (parameterResult.error) {
                    result = {
                        successful: false,
                        message: parameterResult.message,
                        data: null
                    };
                } else {
                    result.data = definedParameters;
                }
            }

            return result;
        }

        /**
         * Ensures that all required parameters are present
         * @param element - The element that this constraint is defined on
         * @param constraint - The constraint in question
         * @param receivedParameters - The parameters that this constraint has received
         * @returns {{error: boolean, message: string}}
         */
        function verifyParameterCountMatches(element, constraint, receivedParameters) {

            var result = {
                error: false,
                message: ""
            };

            if (receivedParameters.__size__ < constraint.params.length) {
                result = {
                    error: true,
                    message: ExceptionService.generateExceptionMessage(element, ConstraintService.ReverseConstraint[constraint.constraintType], "@" + ConstraintService.ReverseConstraint[constraint.constraintType] + " expects at least " + constraint.params.length + " parameter(s). However, you have provided only " + receivedParameters.__size__),
                    data: null
                };
            }

            var missingParams = [];
            for (var j = 0; j < constraint.params.length; j++) {
                var param = constraint.params[j];

                if (typeof receivedParameters[param] === "undefined") {
                    missingParams.push(param);
                }
            }

            //console.log("missing params", missingParams);

            if (missingParams.length > 0) {
                result = {
                    error: true,
                    message: ExceptionService.generateExceptionMessage(element, ConstraintService.ReverseConstraint[constraint.constraintType], "You seem to have provided some optional or required parameters for @" + ConstraintService.ReverseConstraint[constraint.constraintType] + ", but you are still missing the following " + missingParams.length + " required parameter(s): " + ArrayUtils.explode(missingParams, ", ")),
                    data: null
                };
            }

            return result;
        }

        /**
         * Updates the constraint composition-graph using the provided constraint name and its composing constraints.
         * @param constraintName
         * @param composingConstraints
         */
        function updateCompositionGraph(constraintName, composingConstraints) {
            var graphNode = CompositionGraph.getNodeByType(ConstraintService.Constraint[constraintName]);

            if (graphNode == null) {
                CompositionGraph.addNode(ConstraintService.Constraint[constraintName], null);
                graphNode = CompositionGraph.getNodeByType(ConstraintService.Constraint[constraintName]);
            }

            //First we have to remove the existing children
            CompositionGraph.removeChildren(graphNode);
            for (var i = 0; i < composingConstraints.length; i++) {
                var composingConstraintName = ConstraintService.ReverseConstraint[composingConstraints[i].constraintType];
                var composingConstraint = ConstraintService.constraintDefinitions[composingConstraintName];

                if (composingConstraint.compound) {
                    CompositionGraph.addNode(composingConstraint.constraintType, graphNode);
                }
            }
        }

        /**
         * Verifies that the compound constraint that has been defined supplies the correct number of parameters for its
         * composing constraints
         * @param name
         * @param constraints
         * @param params
         */
        function verifyComposingConstraints(name, constraints, params) {
            var constraintList = [];

            for (var i = 0; i < constraints.length; i++) {
                if (typeof constraints[i].constraintType === "undefined") {
                    throw new ExceptionService.Exception.ConstraintDefinitionException("In compound constraint " + name + ": A composing constraint has no constraint type specified.")
                } else {
                    constraintList.push(ConstraintService.constraintDefinitions[ConstraintService.ReverseConstraint[constraints[i].constraintType]]);
                }
            }

            for (var i = 0; i < constraints.length; i++) {
                var constraint = constraints[i];
                var constraintName = ConstraintService.ReverseConstraint[constraint.constraintType];
                var definedParameters = {
                    __size__: 0
                };

                constraint.params = constraint.params || {};

                for (var paramName in constraint.params) if (constraint.params.hasOwnProperty(paramName)) {
                    MapUtils.put(definedParameters, paramName, constraint.params[paramName]);
                }

                /* We need a __size__ property for the params object in constraint, so let's add it */
                var size = 0;
                for (var param in constraint.params) if (constraint.params.hasOwnProperty(param)) {
                    size++;
                }

                constraint.params["__size__"] = size;

                /*
                 Now we will combine the parameters from the compound-constraint parameter-definition into the params map
                 for the composing constraint. Of course, these parameters won't have any values; we just want to make sure
                 that we copy them over so that we can be sure that the composing-constraint contains all the required
                 parameters. The actual values for any parameters inherited from the compound constraint won't be filled in
                 until we evaluate the constraints (i.e., during validation)
                 */

                for (var j = 0; j < params.length; j++) {
                    MapUtils.put(definedParameters, params[j], null);
                }

                var result = ConstraintService.verifyParameterCountMatch(null, ConstraintService.constraintDefinitions[constraintName], definedParameters);

                if (result.error) {
                    throw new ExceptionService.Exception.ConstraintDefinitionException("In compound constraint " + name + ": " + result.message);
                }
            }
        }

        return {
            Constraint: Constraint,
            ReverseConstraint: ReverseConstraint,
            firstCustomConstraintIndex: firstCustomConstraintIndex,
            constraintDefinitions: constraintDefinitions,
            override: override,
            custom: custom,
            compound: compound,
            verifyConstraintDefinition: verifyConstraintDefinition,
            verifyParameterCountMatch: verifyParameterCountMatches
        };
    })();

    /**
     * Encapsulates logic related to groups.
     * @type {{Group: {}, ReverseGroup: {}, deletedGroupIndices: Array, firstCustomGroupIndex: number}}
     */
    var GroupService = {
        Group: {},
        ReverseGroup: {},
        deletedGroupIndices: [],
        firstCustomGroupIndex: 0
    };

    GroupService = (function() {
        var Group = {
            Default: 0
        };

        var ReverseGroup = {
            0: "Default"
        };

        /* New groups are added to our 'enum' sequentially with the help of an explicit index that is maintained separately
         (see firstCustomGroupIndex). When groups are deleted, we need to remove them from the Group 'enum'. Simply
         removing them would be fine. But what we end up with are "gaps" in the indices. For example, assume that we added
         a new group called "New". Then regula.Group.New is mapped to 1 in regula.ReverseGroup, and 1 is mapped back to "New".
         Assume that we add another group called "Newer". So now what you have Newer -> 2 -> "Newer". Let's say we delete
         the "New" group. The existing indices are 0 and 2. As you can see, there is a gap. Now although the indices
         themselves don't mean anything (and we don't rely on their actual numerical values in anyway) when you now add
         another group, the index for that group will be 3. So repeated additions and deletions of groups will keep
         incrementing the index. I am uncomfortable with this (what if it increments past MAX_INT? Unlikely, but possible
         -- it doesn't hurt to be paranoid) and so I'd like to reuse deleted indices. For this reason I'm going to maintain
         a stack of deleted-group indices. When I go to add a new group, I'll first check this stack to see if there are
         any indices there. If there are, I'll use one. Conversely, when I delete a group, I'll add its index to this stack
         */

        /*
        TODO: currently providing direct access to these. Should probably be hidden behind service calls that modify these.
        TODO: outside could shouldn't be modifying this directly. The same goes for Constraint.
         */
        var deletedGroupIndices = [];
        var firstCustomGroupIndex = 1;

        return {
            Group: Group,
            ReverseGroup: ReverseGroup,
            deletedGroupIndices: deletedGroupIndices,
            firstCustomGroupIndex: firstCustomGroupIndex
        };
    })();

    /**
     * Contains the logic for the recursive-descent parser that parses constraint-definition strings
     * @type {{parse: Function}}
     */

    var Parser = {
        parse: function(element, constraintDefinitionString) {}
    };

    Parser = (function() {

        /** A few utility functions that are used by the parser, but are not directly related to parsing **/

        /**
         * Removes leading and trailing whitespaces from a string
         * @param str
         * @returns {string}
         */
        function trim(str) {
            return str ? str.replace(/^\s+/, "").replace(/\s+$/, "") : "";
        }

        /**
         * Returns the first element of an array. Does not modify the array.
         * @param arr
         * @returns {*}
         */
        function peek(arr) {
            return arr[0];
        }

        /**
         * Tokenizes a string into tokens based on the options provided
         * @param options
         * @returns {Array}
         */
        function tokenize(options) {
            var str = options.str;
            var delimiters = options.delimiters.split("");
            var returnDelimiters = options.returnDelimiters || false;
            var returnEmptyTokens = options.returnEmptyTokens || false;
            var tokens = [];
            var lastTokenIndex = 0;

            for (var i = 0; i < str.length; i++) {
                if (MapUtils.exists(delimiters, str.charAt(i))) {
                    var token = str.substring(lastTokenIndex, i);

                    if (token.length == 0) {
                        if (returnEmptyTokens) {
                            tokens.push(token);
                        }
                    } else {
                        tokens.push(token);
                    }

                    if (returnDelimiters) {
                        tokens.push(str.charAt(i));
                    }

                    lastTokenIndex = i + 1;
                }
            }

            if (lastTokenIndex < str.length) {
                var token = str.substring(lastTokenIndex, str.length);

                if (token.length == 0) {
                    if (returnEmptyTokens) {
                        tokens.push(token);
                    }
                } else {
                    tokens.push(token);
                }
            }

            return tokens;
        }

        /**
         * This is the parser that parses constraint definitions. The recursive-descent parser is actually defined inside
         * the 'parse' function (I've used inner functions to encapsulate the parsing logic).
         *
         * This function parses the constraint-definition string on an element. If errors are encountered during parsing,
         * exceptions are thrown. If parsing is successful, then the constraint-definition string is reified into actual
         * constraints along with their parameters and their values. This information is then returned to the calling
         * function.
         *
         * @param element
         * @param constraintDefinitionString
         * @returns {{successful: boolean, message: string, data: null}}
         */

        function parse(element, constraintDefinitionString) {

            var currentConstraintName = "";
            var tokens = tokenize({
                str: trim(constraintDefinitionString.replace(/\s*\n\s*/g, "")),
                delimiters: "@()[]=,\"\\/-\\.",
                returnDelimiters: true,
                returnEmptyTokens: false
            });

            return constraints(tokens);


            /** the recursive-descent parser starts here **/
            /** it parses according to the following EBNF **/

            /**
             constraints            ::= { constraint }
             constraint             ::= "@", constraint-def
             constraint-def         ::= constraint-name, param-def
             constraint-name        ::= valid-starting-char { valid-char }
             valid-starting-char    ::= [A-Za-z_]
             valid-char             ::= [0-9A-Za-z_]
             param-def              ::= [ "(", [ param { ",", param } ], ")" ]
             param                  ::= param-name, "=", param-value
             param-name             ::= valid-starting-char { valid-char }
             param-value            ::= number | quoted-string | regular-expression | boolean | group-definition
             number                 ::= positive | negative
             negative               ::= "-", positive
             positive               ::= integer, [ fractional ] | fractional
             integer                ::= digit { digit }
             fractional             ::= ".", integer
             quoted-string          ::= "\"", { char }, "\""
             boolean                ::= true | false
             char                   ::= .
             regular-expression     ::= "/", { char }, "/"
             group-definition       ::= "[", [ group { ",", group } ] "]"
             group                  ::= valid-starting-char { valid-char }

             **/

            function constraints(tokens) {
                var result = {
                    successful: true,
                    message: "",
                    data: null
                };

                var constraintsToAttach = [];

                while (tokens.length > 0 && result.successful) {
                    result = constraint(tokens);
                    constraintsToAttach.push(result.data);
                }

                result.data = constraintsToAttach;

                return result;
            }

            function constraint(tokens) {
                var result = {
                    successful: true,
                    message: "",
                    data: null
                };

                var token = tokens.shift();

                //get rid of spaces if any
                if (trim(token).length == 0) {
                    token = tokens.shift();
                }

                if (token == "@") {
                    result = constraintDef(tokens)
                } else {
                    result = {
                        successful: false,
                        message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Invalid constraint. Constraint definitions need to start with '@'") + " " + result.message,
                        data: null
                    };
                }

                return result;
            }

            function constraintDef(tokens) {
                var alias = {
                    Between: "Range",
                    Matches: "Pattern",
                    Empty: "Blank",
                    NotEmpty: "NotBlank",
                    IsAlpha: "Alpha",
                    IsNumeric: "Integer",
                    IsAlphaNumeric: "AlphaNumeric"
                };

                var result = constraintName(tokens);

                if (result.successful) {
                    currentConstraintName = result.data;

                    currentConstraintName = alias[currentConstraintName] ? alias[currentConstraintName] : currentConstraintName;

                    if (ConstraintService.constraintDefinitions[currentConstraintName]) {
                        result = paramDef(tokens);

                        if (result.successful) {
                            result = ConstraintService.verifyConstraintDefinition(element, currentConstraintName, result.data);

                            if (result.successful) {
                                var definedParameters = result.data;
                                result.data = {
                                    element: element,
                                    constraintName: currentConstraintName,
                                    definedParameters: definedParameters
                                };
                            }
                        }
                    } else {
                        result = {
                            successful: false,
                            message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "I cannot find the specified constraint name. If this is a custom constraint, you need to define it before you bind to it") + " " + result.message,
                            data: null
                        };
                    }
                } else {
                    result = {
                        successful: false,
                        message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Invalid constraint name in constraint definition") + " " + result.message,
                        data: null
                    };
                }

                return result;
            }

            function constraintName(tokens) {
                var token = trim(tokens.shift());
                var result = validStartingCharacter(token.charAt(0));

                if (result.successful) {
                    var i = 1;
                    while (i < token.length && result.successful) {
                        result = validCharacter(token.charAt(i));
                        i++;
                    }

                    if (result.successful) {
                        result.data = token;
                    }
                } else {
                    result = {
                        successful: false,
                        message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Invalid starting character for constraint name. Can only include A-Z, a-z, and _") + " " + result.message,
                        data: null
                    };
                }


                return result;
            }

            function validStartingCharacter(character) {
                var result = {
                    successful: true,
                    message: "",
                    data: null
                };

                if (!/[A-Za-z_]/.test(character) || typeof character === "undefined" || character == null) {
                    result = {
                        successful: false,
                        message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Invalid starting character"),
                        data: null
                    };
                }

                return result;
            }

            function validCharacter(character) {
                var result = {
                    successful: true,
                    message: "",
                    data: null
                };

                if (!/[0-9A-Za-z_]/.test(character)) {
                    result = {
                        successful: false,
                        message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Invalid character in identifier. Can only include 0-9, A-Z, a-z, and _") + " " + result.message,
                        data: null
                    };
                }

                return result;
            }

            function paramDef(tokens) {
                var result = {
                    successful: true,
                    message: "",
                    data: {}
                };

                if (peek(tokens) == "(") {
                    tokens.shift(); // get rid of the (

                    var data = {};

                    if (peek(tokens) == ")") {
                        tokens.shift(); //get rid of the )
                    } else {
                        result = param(tokens);

                        if (result.successful) {
                            MapUtils.put(data, result.data.name, result.data.value);

                            //get rid of spaces
                            if (trim(peek(tokens)).length == 0) {
                                tokens.shift();
                            }

                            while (tokens.length > 0 && peek(tokens) == "," && result.successful) {

                                tokens.shift();
                                result = param(tokens);

                                if (result.successful) {
                                    MapUtils.put(data, result.data.name, result.data.value);

                                    //get rid of spaces;
                                    if (trim(peek(tokens)).length == 0) {
                                        tokens.shift();
                                    }
                                }
                            }

                            if (result.successful) {
                                var token = tokens.shift();

                                //get rid of spaces
                                if (trim(token).length == 0) {
                                    token = tokens.shift();
                                }

                                if (token != ")") {
                                    result = {
                                        successful: false,
                                        message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Cannot find matching closing ) in parameter list") + " " + result.message,
                                        data: null
                                    };
                                } else {
                                    result.data = data;
                                }
                            }
                        } else {
                            result = {
                                successful: false,
                                message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Invalid parameter definition") + " " + result.message,
                                data: null
                            };
                        }
                    }
                } else if (peek(tokens) !== undefined && peek(tokens) != "@") {
                    //The next token MUST be a @ if we are expecting further constraints
                    result = {
                        successful: false,
                        message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Unexpected character '" + peek(tokens) + "'" + " after constraint definition") + " " + result.message,
                        data: null
                    };
                }

                return result;
            }

            function param(tokens) {
                var result = paramName(tokens);

                if (result.successful) {
                    var parameterName = result.data;
                    var token = tokens.shift();

                    if (token == "=") {
                        result = paramValue(tokens);

                        if (result.successful) {
                            result.data = {
                                name: parameterName,
                                value: result.data
                            };
                        } else {
                            result = {
                                successful: false,
                                message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Invalid parameter value") + " " + result.message,
                                data: null
                            };
                        }
                    } else {
                        tokens.unshift(token);
                        result = {
                            successful: false,
                            message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "'=' expected after parameter name" + " " + result.message),
                            data: null
                        };
                    }
                } else {
                    result = {
                        successful: false,
                        message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Invalid parameter name. You might have unmatched parentheses") + " " + result.message,
                        data: null
                    };
                }

                return result;
            }

            function paramName(tokens) {
                var token = trim(tokens.shift());

                //get rid of space
                if (token.length == 0) {
                    token = tokens.shift();
                }

                var result = {
                    successful: false,
                    message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Invalid starting character for parameter name. Can only include A-Z, a-z, and _"),
                    data: null
                };

                if (typeof token !== "undefined") {
                    result = validStartingCharacter(token.charAt(0));

                    if (result.successful) {
                        var i = 1;
                        while (i < token.length && result.successful) {
                            result = validCharacter(token.charAt(i));
                            i++;
                        }

                        if (result.successful) {
                            result.data = token;
                        }
                    } else {
                        result = {
                            successful: false,
                            message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Invalid starting character for parameter name. Can only include A-Z, a-z, and _") + " " + result.message,
                            data: null
                        };
                    }
                }

                return result;
            }

            function paramValue(tokens) {

                //get rid of spaces
                if (trim(peek(tokens)).length == 0) {
                    tokens.shift();
                }

                var result = {
                    successful: true,
                    message: "",
                    data: []
                };

                if (peek(tokens) == ")") {
                    result = {
                        successful: false,
                        message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Parameter value expected") + " " + result.message,
                        data: null
                    };
                } else {
                    result = number(tokens);

                    var message = result.message;

                    if (!result.successful) {
                        result = quotedString(tokens);

                        result.message = result.message + " " + message;
                        message = result.message;

                        if (!result.successful) {
                            result = regularExpression(tokens);

                            result.message = result.message + " " + message;
                            message = result.message;

                            if (!result.successful) {
                                result = booleanValue(tokens);

                                result.message = result.message + " " + message;
                                message = result.message;

                                if (!result.successful) {
                                    result = groupDefinition(tokens);

                                    result.message = result.message + " " + message;
                                    message = result.message;

                                    if (!result.successful) {
                                        result = {
                                            successful: false,
                                            message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Parameter value must be a number, quoted string, regular expression, or a boolean") + " " + message,
                                            data: null
                                        };
                                    }
                                }
                            }
                        }
                    }
                }

                return result;
            }

            function number(tokens) {
                var result = negative(tokens);

                if (!result.successful) {
                    result = positive(tokens);

                    if (!result.successful) {
                        result = {
                            successful: false,
                            message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Parameter value is not a number") + " " + result.message,
                            data: null
                        };
                    }
                }

                return result;
            }

            function negative(tokens) {
                var token = tokens.shift();
                var result = {
                    successful: true,
                    message: "",
                    data: null
                };

                if (token == "-") {
                    result = positive(tokens);
                    if (result.successful) {
                        result.data = token + result.data;
                    }
                } else {
                    tokens.unshift(token);
                    result = {
                        successful: false,
                        message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Not a negative number"),
                        data: null
                    };
                }

                return result;
            }

            function positive(tokens) {

                var result = null;

                if (peek(tokens) != ".") {
                    result = integer(tokens);

                    if (peek(tokens) == ".") {
                        var integerPart = result.data;

                        result = fractional(tokens);

                        if (result.successful) {
                            result.data = integerPart + result.data;
                        }

                    }
                } else {
                    result = fractional(tokens);
                }

                if (!result.successful) {
                    result = {
                        successful: false,
                        message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Not a positive number") + " " + result.message,
                        data: null
                    };
                }

                return result;
            }

            function fractional(tokens) {

                var token = tokens.shift(); //get rid of the .
                var result = integer(tokens);

                if (result.successful) {
                    result.data = token + result.data;
                } else {
                    result = {
                        successful: false,
                        message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Not a valid fraction"),
                        data: null
                    };
                }

                return result;
            }

            function integer(tokens) {
                var token = trim(tokens.shift());
                var result = digit(token.charAt(0));

                if (result.successful) {
                    var i = 1;
                    while (i < token.length && result.successful) {
                        result = digit(token.charAt(i));
                        i++;
                    }

                    if (result.successful) {
                        result.data = token;
                    }
                } else {
                    tokens.unshift(token);
                    result = {
                        successful: false,
                        message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Not a valid integer") + " " + result.message,
                        data: []
                    };
                }

                return result;
            }

            function digit(character) {
                var result = {
                    successful: true,
                    message: "",
                    data: null
                };

                if (!/[0-9]/.test(character)) {
                    result = {
                        successful: false,
                        message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Not a valid digit"),
                        data: null
                    };
                }

                return result;
            }

            function quotedString(tokens) {
                var token = tokens.shift();
                var data = "";
                var result = {
                    successful: true,
                    message: "",
                    data: null
                };

                if (token == "\"") {
                    var done = false;

                    while (tokens.length > 0 && result.successful && !done) {

                        if (peek(tokens) == "\"") {
                            done = true;
                            tokens.shift(); //get rid of "
                        } else {
                            result = character(tokens);
                            data += result.data;
                        }
                    }

                    if (!done) {
                        result = {
                            successful: false,
                            message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Unterminated string literal"),
                            data: null
                        };
                    }
                } else {
                    tokens.unshift(token);
                    result = {
                        successful: false,
                        message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Invalid quoted string"),
                        data: null
                    };
                }

                // This boolean expression is the result of the simplification of the following truth table:
                // S | D | R
                // 1 | 0 | 0
                // 1 | 1 | 1 << what we need
                // 0 | 0 | 0
                // 0 | 1 | 0

                result.successful = result.successful && done;
                result.data = data;
                return result;
            }

            function character(tokens) {
                var data = "";
                var token = tokens.shift();

                if (token == "\\") {
                    data = tokens.shift();
                }

                return {
                    successful: true,
                    message: "",
                    data: token + data
                }; //match any old character
            }

            function regularExpression(tokens) {
                var data = "";
                var token = tokens.shift();
                var result = {
                    successful: true,
                    message: "",
                    data: null
                };

                if (token == "/") {
                    data = token;
                    var done = false;

                    while (tokens.length > 0 && result.successful && !done) {

                        if (peek(tokens) == "/") {
                            data += tokens.shift();
                            done = true;
                        } else {
                            result = character(tokens);
                            data += result.data;
                        }
                    }

                    if (!done) {
                        result = {
                            successful: false,
                            message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Unterminated regex literal"),
                            data: null
                        };
                    }
                } else {
                    tokens.unshift(token);
                    result = {
                        successful: false,
                        message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Not a regular expression"),
                        data: null
                    };
                }

                result.successful = result.successful && done;
                result.data = data;
                return result;
            }

            function booleanValue(tokens) {
                var token = tokens.shift();
                var result = {
                    successful: true,
                    message: "",
                    data: null
                };

                if (trim(token) == "true" || trim(token) == "false") {
                    result = {
                        successful: true,
                        message: "",
                        data: !! (token === "true")
                    };
                } else {
                    tokens.unshift(token);
                    result = {
                        successful: false,
                        message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Not a boolean"),
                        data: null
                    };
                }

                return result;
            }

            function groupDefinition(tokens) {
                var data = "";
                var token = tokens.shift();
                var result = {
                    successful: true,
                    message: "",
                    data: null
                };

                if (token == "[") {

                    //get rid of spaces
                    if (trim(peek(tokens)).length == 0) {
                        tokens.shift();
                    }

                    if (peek(tokens) == "]") {
                        result = {
                            successful: true,
                            message: "",
                            data: ""
                        };
                    } else {
                        result = group(tokens);
                    }

                    if (result.successful) {
                        data = result.data;

                        //get rid of spaces
                        if (trim(peek(tokens)).length == 0) {
                            tokens.shift();
                        }

                        while (tokens.length > 0 && peek(tokens) == "," && result.successful) {
                            tokens.shift();
                            result = group(tokens);

                            data += "," + result.data;

                            if (trim(peek(tokens)).length == 0) {
                                tokens.shift();
                            }
                        }

                        result.data = data;

                        token = tokens.shift();

                        //get rid of spaces
                        if (trim(token).length == 0) {
                            tokens.shift();
                        }

                        if (token != "]") {
                            result = {
                                successful: false,
                                message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Cannot find matching closing ] in group definition") + " " + result.message,
                                data: null
                            };
                        }
                    } else {
                        result = {
                            successful: false,
                            message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Invalid group definition") + " " + result.message,
                            data: null
                        };
                    }
                } else {
                    tokens.unshift(token);
                    result = {
                        successful: false,
                        message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Not a valid group definition"),
                        data: null
                    };
                }

                return result;
            }

            function group(tokens) {
                var result = {
                    successful: true,
                    message: "",
                    data: ""
                };

                var token = trim(tokens.shift());

                //get rid of space
                if (token.length == 0) {
                    token = tokens.shift();
                }

                result = validStartingCharacter(token.charAt(0));

                if (result.successful) {
                    var i = 1;
                    while (i < token.length && result.successful) {
                        result = validCharacter(token.charAt(i));
                        i++;
                    }

                    if (result.successful) {
                        result.data = token;
                    }
                } else {
                    result = {
                        successful: false,
                        message: ExceptionService.generateExceptionMessage(element, currentConstraintName, "Invalid starting character for group name. Can only include A-Z, a-z, and _") + " " + result.message,
                        data: null
                    };
                }

                return result;
            }
        }

        return {
            parse: parse
        };
    })();

    /**
     * Contains logic that deals with binding constraints to elements
     * @type {{initializeBoundConstraints: Function, resetBoundConstraints: Function, getBoundConstraints: Function,
     *         removeElementAndGroupFromBoundConstraintsIfEmpty: Function, bindAfterParsing: Function, bindHTML5ValidationConstraints: Function,
     *         bindFromOptions: Function, unbind: Function}}
     */
    var BindingService = {
        initializeBoundConstraints: function() {},
        resetBoundConstraints: function() {},
        getBoundConstraints: function() {},
        removeElementAndGroupFromBoundConstraintsIfEmpty: function(id, group) {},
        bindAfterParsing: function(options) {},
        bindHTML5ValidationConstraints: function(options) {},
        bindFromOptions: function(options) {},
        unbind: function(options) {}
    };

    BindingService = (function() {

        var boundConstraints = null;

        /**
         * Initializes bound constraints to their initial state only if they have not been initalized (i.e., they are null).
         */
        function initializeBoundConstraints() {
            if(boundConstraints === null) {
                resetBoundConstraints();
            }
        }

        /**
         * Resets bound constraints to their initial state. This has the effect of pretty much unbinding everything.
         */
        function resetBoundConstraints() {
            boundConstraints = {
                Default: {}
            };
        }

        /**
         * Returns bound constraints
         * @returns {}
         */
        function getBoundConstraints() {
            return boundConstraints;
        }

        /**
         * Removes the element and/or group entry from the boundConstraints map if neither of those have any constraints
         * bound to them.
         * @param id
         * @param group
         */
        function removeElementAndGroupFromBoundConstraintsIfEmpty(id, group) {
            if (MapUtils.isEmpty(boundConstraints[group][id])) {
                delete boundConstraints[group][id];

                if (MapUtils.isEmpty(boundConstraints[group])) {
                    delete boundConstraints[group];

                    var groupIndex = GroupService.Group[group];
                    delete GroupService.Group[group];
                    delete GroupService.ReverseGroup[groupIndex];

                    GroupService.deletedGroupIndices.push(groupIndex);
                }
            }
        }

        /**
         * This function will attempt to bind constraints to an element by parsing its "data-constraints" attribute. If
         * the "element" attribute has not been provided, then this function will attempt to parse the "data-constraints"
         * attribute of any element that has it.
         *
         * @param options
         * @returns {{successful: boolean, message: string, data: null}}
         */
        function bindAfterParsing(options) {
//            console.log("bAP:", options);
            var element = options.element;
            var elementsWithRegulaValidation;

            if (element === null) {
                elementsWithRegulaValidation = DOMUtils.getElementsByAttribute(document.body, "*", "data-constraints");
            } else {
                elementsWithRegulaValidation = [element];
            }

            var result = {
                successful: true,
                message: "",
                data: null
            };

            var i = 0;
            while (i < elementsWithRegulaValidation.length && result.successful) {
                element = elementsWithRegulaValidation[i];
                var tagName = element.tagName.toLowerCase();

                if (tagName != "form" && tagName != "select" && tagName != "textarea" && tagName != "input") {
                    result = {
                        successful: false,
                        message: tagName + "#" + element.id + " is not an input, select, textarea, or form element! Validation constraints can only be attached to input, select, textarea, or form elements.",
                        data: null
                    };
                } else {
                    // automatically assign an id if the element does not have one
                    if (!element.id) {
                        element.id = DOMUtils.generateRandomId();
                    }

                    var dataConstraintsAttribute = element.getAttribute("data-constraints");
                    result = Parser.parse(element, dataConstraintsAttribute);

                    if(result.successful && result.data !== null) {
                        var constraintsToAttach = result.data;
                        var j = 0;

                        while(result.successful && j < constraintsToAttach.length) {
                            var constraintToAttach = constraintsToAttach[j];
                            result = attachConstraintDefinitionToElement(constraintToAttach.element, constraintToAttach.constraintName, constraintToAttach.definedParameters);
                            j++;
                        }
                    }

                    i++;
                }
            }

            return result;
        }

        /*
         TODO: Figure out how to handle programmatic binding of HTML5 Validation constraints. Do we create the attributes?
         TODO: Figure out how HTML5 validation binding works with bindFromOptions() and bindFromOptionsWithElements()
         */

        /**
         * This function will attempt to bind html5 constraints to the specified element. If the "element" attribute has
         * not been provided, it will attempt to find any elements in the DOM with any html5 constraints, and then try to
         * bind those constraints to their respective elements. Internally, the html5 validation constraints are
         * translated to their Regula "HTML5" equivalents (i.e., "required" is converted to "HTML5Required", etc.).
         *
         * @param options
         * @returns {{successful: boolean, message: string, data: null}}
         */

        function bindHTML5ValidationConstraints(options) {
            var element = options.element;

            var result = {
                successful: true,
                message: "",
                data: null
            };

            /**
             * A list of HTML5 constraints. This list essentially helps us match up HTML5 validation constraints with their
             * regula equivalents. The "attribute" property essentially describes the HTML attribute used to describe the
             * HTML5 validation constraint. For example, the "required" constraint is described by the "required" attribute.
             * The "value" property describes what the expected value is for a specific attribute. For example, for the
             * email-validation constraint, the HTML attribute is "type" and the associated value is "email".
             *
             */
            var html5Constraints = [{
                attribute: "required",
                value: null,
                constraint: ConstraintService.Constraint.HTML5Required
            }, {
                attribute: "type",
                value: "email",
                constraint: ConstraintService.Constraint.HTML5Email
            }, {
                attribute: "type",
                value: "url",
                constraint: ConstraintService.Constraint.HTML5URL
            }, {
                attribute: "type",
                value: "number",
                constraint: ConstraintService.Constraint.HTML5Number
            }, {
                attribute:"type",
                value: "datetime",
                constraint: ConstraintService.Constraint.HTML5DateTime
            }, {
                attribute: "type",
                value: "datetime-local",
                constraint: ConstraintService.Constraint.HTML5DateTimeLocal
            }, {
                attribute: "type",
                value: "date",
                constraint: ConstraintService.Constraint.HTML5Date
            }, {
                attribute: "type",
                value: "month",
                constraint: ConstraintService.Constraint.HTML5Month
            }, {
                attribute: "type",
                value: "time",
                constraint: ConstraintService.Constraint.HTML5Time
            }, {
                attribute: "type",
                value: "week",
                constraint: ConstraintService.Constraint.HTML5Week
            }, {
                attribute: "type",
                value: "range",
                constraint: ConstraintService.Constraint.HTML5Range
            }, {
                attribute: "type",
                value: "tel",
                constraint: ConstraintService.Constraint.HTML5Tel
            }, {
                attribute: "type",
                value: "color",
                constraint: ConstraintService.Constraint.HTML5Color
            }, {
                attribute: "pattern",
                value: null,
                constraint: ConstraintService.Constraint.HTML5Pattern
            }, {
                attribute: "maxlength",
                value: null,
                constraint: ConstraintService.Constraint.HTML5MaxLength
            }, {
                attribute: "min",
                value: null,
                constraint: ConstraintService.Constraint.HTML5Min
            }, {
                attribute: "max",
                value: null,
                constraint: ConstraintService.Constraint.HTML5Max
            }, {
                attribute: "step",
                value: null,
                constraint: ConstraintService.Constraint.HTML5Step
            }];

            /**
             * Maps the value of the HTML "type" attribute to the equivalent Regula HTML5 constraint.
             */
            var typeToRegulaConstraint = {
                email: ConstraintService.Constraint.HTML5Email,
                url: ConstraintService.Constraint.HTML5URL,
                number: ConstraintService.Constraint.HTML5Number,
                datetime: ConstraintService.Constraint.HTML5DateTime,
                "datetime-local": ConstraintService.Constraint.HTML5DateTimeLocal,
                date: ConstraintService.Constraint.HTML5Date,
                month: ConstraintService.Constraint.HTML5Month,
                time: ConstraintService.Constraint.HTML5Time,
                week: ConstraintService.Constraint.HTML5Week,
                range: ConstraintService.Constraint.HTML5Range,
                tel: ConstraintService.Constraint.HTML5Tel,
                color: ConstraintService.Constraint.HTML5Color
            };

            /**
             * This function iterates over the list of elements that have a specific HTML5 constraint, and converts that
             * information over the Regula equivalent. Once the information has been converted, it is added to the
             * (in/out) "elementMap" parameter.
             *
             * For example, say that all elements have the "required" attribute. This will be converted into HTML5Required.
             *
             * @param elementMap - An in/out parameter. Keeps track of elements and their associated constraints (regula equivalents of HTML5 constraints)
             * @param elements - List of elements that have the constraint specified by "html5Constraint"
             * @param html5Constraint - The HTML5 constraint that every member of "elements" has.
             */
            function addConstraintToElementMap(elementMap, elements, html5Constraint) {
                for (var i = 0; i < elements.length; i++) {

                    var element = elements[i];
                    if (!element.id) {
                        element.id = DOMUtils.generateRandomId();
                    }

                    if (!elementMap[element.id]) {
                        elementMap[element.id] = [];
                    }

                    var constraintDefinition = {
                        constraint: html5Constraint.constraint,
                        params: {}
                    };

                    /**
                     * Type-validation constraints don't take in any parameters. So we don't need to look at the "value" parameter here.
                     */
                    if (html5Constraint.value === null) {
                        constraintDefinition.params[html5Constraint.attribute] = DOMUtils.getAttributeValueForElement(element, html5Constraint.attribute);
                    }

                    elementMap[element.id].push(constraintDefinition);
                }
            }

            var elementsWithHTML5Validation = {};

            /**
             * If "element" is null, it means that we need to go through our list of HTML5 constraints and check to see which
             * elements in the document have them. Otherwise, we need to go through our list of HTML5 constraints and see if the
             * supplied element has any of them.
             */
            if(element === null) {
                for (var i = 0; i < html5Constraints.length; i++) {
                    var html5Constraint = html5Constraints[i];

                    var elements = null;
                    if(html5Constraint.value == null) {
                       elements = DOMUtils.getElementsByAttribute(document.body, "*", html5Constraint.attribute);
                    } else {
                       elements = DOMUtils.getElementsByAttribute(document.body, "*", html5Constraint.attribute, html5Constraint.value);
                    }

                    addConstraintToElementMap(elementsWithHTML5Validation, elements, html5Constraint);
                }
            } else {
                if(!element.id) {
                    element.id = DOMUtils.generateRandomId();
                }

                elementsWithHTML5Validation[element.id] = [];

                for (var i = 0; i < html5Constraints.length; i++) {
                    var html5Constraint = html5Constraints[i];

                    /**
                     * If we don't care about the HTML5 validation attribute's value, then it means that we just have to see if
                     * that specific attribute exists on the element. If it does, we can add it to our map. Otherwise it means
                     * that we have a type-validation constraint and so we will need to look at the value of the attribute to
                     * figure out the appropriate constraint.
                     */
                    if (html5Constraint.value == null) {
                        if (DOMUtils.getAttributeValueForElement(element, html5Constraint.attribute) != null) {
                            var constraintDefinition = {
                                constraint: html5Constraint.constraint,
                                params: {}
                            };

                            constraintDefinition.params[html5Constraint.attribute] = DOMUtils.getAttributeValueForElement(element, html5Constraint.attribute);
                            elementsWithHTML5Validation[element.id].push(constraintDefinition);
                        }
                    } else {
                        var value = DOMUtils.getAttributeValueForElement(element, html5Constraint.attribute);

                        if (value != null) {
                            elementsWithHTML5Validation[element.id].push({
                                constraint: typeToRegulaConstraint[value],
                                params: {}
                            });
                        }
                    }
                }

            }

            MapUtils.iterateOverMap(elementsWithHTML5Validation, function (elementId, constraintDefinitions, index) {
                var element = document.getElementById(elementId);

                for (var i = 0; i < constraintDefinitions.length; i++) {
                    var constraintDefinition = constraintDefinitions[i];
                    result = attachConstraintDefinitionToElement(element, ConstraintService.ReverseConstraint[constraintDefinition.constraint], constraintDefinition.params);
                }
            });

            return result;
        }

        /**
         * This function basically supports the "explicit" programmatic-binding of constraints to elements. A call to just regula.bind() will end up
         * performing binding on any element that has constraints. By providing options to regula.bind(), one can target specific elements or just
         * a single element. This particular function operates on a single element. If multiple elements have been provided, bind() within the regula
         * module will iterate over those elements and then call this function. This function can performing binding in one of two ways: if constraint
         * definitions haven't been specified explicitly (i.e., programmatic specification of constraints to bind to the element), then the function
         * will call the bindAfterParsing() function. If the constraints have been specified programmatically, this function will call the
         * bindUsingConstraintDefinitions() function.
         *
         * @param options
         * @returns {{successful: boolean, message: string, data: null}}
         */
        function bindFromOptions(options) {
            //console.log("bFO");

            var result = {
                successful: true,
                message: "",
                data: null
            };

            var element = options.element;
            var constraints = options.constraints || [];
            var tagName = (element && element.tagName) ? element.tagName.toLowerCase() : null;

            if (!element) {
                result = {
                    successful: false,
                    message: "regula.bind expects a non-null element attribute in the options argument. " + ExceptionService.explodeParameters(options),
                    data: null
                };
            } else if (element.nodeType !== 1) { //Must be an HTMLElement
                result = {
                    successful: false,
                    message: "regula.bind: element attribute is expected to be an HTMLElement, but was of unexpected type: " + typeof element + ". " + ExceptionService.explodeParameters(options),
                    data: null
                };
            } else if (tagName != "form" && tagName != "select" && tagName != "textarea" && tagName != "input") {
                result = {
                    successful: false,
                    message: tagName + "#" + element.id + " is not an input, select, textarea, or form element! Validation constraints can only be attached to input, select, textarea, or form elements. " + ExceptionService.explodeParameters(options),
                    data: null
                };
            } else {
                if (constraints.length > 0) {

                    var i = 0;
                    while (i < constraints.length && result.successful) {
                        result = bindUsingConstraintDefinition(constraints[i], options);
                        i++;
                    }
                } else {
                    result = bindAfterParsing({
                        element: element
                    });
                }
            }

            return result;
        }

        function bindUsingConstraintDefinition(constraint, options) {

            /** A few inner utility-functions **/

            /**
             * Returns the union of the first and second set
             * @param first
             * @param second
             * @returns {Array}
             */
            function union(first, second) {
                var inserted = {};
                var union = [];

                for (var i = 0; i < first.length; i++) {
                    union.push(first[i]);
                    inserted[first[i]] = true;
                }

                for (var j = 0; j < second.length; j++) {
                    if (!inserted[second[j]]) {
                        union.push(second[j]);
                    }
                }

                return union;
            }

            /**
             * Subtracts the second set from the first
             * @param second
             * @param first
             * @returns {Array}
             */
            function subtract(second, first) {
                var difference = [];

                for (var i = 0; i < first.length; i++) {
                    if (!MapUtils.exists(second, first[i])) {
                        difference.push(first[i]);
                    }
                }

                return difference;
            }

            /**
             * Special logic to handle group-overwriting logic.
             * We need to see if we need to remove this constraint-element combination from any group(s). For example,
             * assume that we originally had the groups "First" and "Second" and then the user sent in "Second" and
             * "Third". This means that we have to remove this constraint from the "First" group. So basically, the
             * groups we need to remove the element-constraint combination from can be found by performing the following
             * operation:
             *
             * (Go union Gn) - Gn
             *
             * Where:
             *
             * o Go is the old group set
             * o Gn is the new group set
             *
             * @param element
             * @param constraintType
             * @param definedParameters
             */
            function overwriteGroups(element, constraintType, definedParameters) {
                var oldGroups = boundConstraints[GroupService.ReverseGroup[GroupService.Group.Default]][element.id][ConstraintService.ReverseConstraint[constraintType]]["groups"].split(/,/);

                var newGroups = [];

                if (definedParameters["groups"]) {
                    newGroups = definedParameters["groups"].split(/,/);
                } else {
                    newGroups.push(GroupService.ReverseGroup[GroupService.Group.Default]);
                }

                /**
                 * If the list of groups does not contain the "Default" group, let's add it because we don't want to delete it if
                 * the user did not specify it
                 */
                if (!MapUtils.exists(newGroups, GroupService.ReverseGroup[GroupService.Group.Default])) {
                    newGroups.push(GroupService.ReverseGroup[GroupService.Group.Default]);
                }

                /**
                 * groupsToRemoveConstraintFrom = (oldGroups union newGroups) - newGroups
                 */
                var groupsToRemoveConstraintFrom = subtract(newGroups, union(oldGroups, newGroups));

                for (var i = 0; i < groupsToRemoveConstraintFrom.length; i++) {
                    var group = groupsToRemoveConstraintFrom[i];

                    delete boundConstraints[group][element.id][ConstraintService.ReverseConstraint[constraintType]];
                    removeElementAndGroupFromBoundConstraintsIfEmpty(element.id, group);
                }
            }

            var result = {
                successful: true,
                message: "",
                data: null
            };

            var element = options.element;
            var overwriteConstraint = constraint.overwriteConstraint || false;
            var overwriteParameters = constraint.overwriteParameters || false;
            var constraintType = constraint.constraintType;
            var definedParameters = constraint.params || {};
            var newParameters = {
                __size__: 0
            };

            /** We check to see if this was a valid/defined constraint. It wasn't so we need to return an error message **/
            if (typeof constraintType === "undefined") {
                result = {
                    successful: false,
                    message: "regula.bind expects a valid constraint type for each constraint in constraints attribute of the options argument. " + ExceptionService.explodeParameters(options),
                    data: null
                };
            }

            /** we also need to make sure groups make sense (if we got any) **/
            else if (definedParameters && definedParameters["groups"]) {

                if (definedParameters["groups"] instanceof Array) {

                    /** We need to normalize the "groups" parameter that the user sends in. The user sends in the groups parameter as an array of 'enum'
                     * values, or if it is a new constraint, a string. We need to normalize this into a string of comma-separated values. While we're
                     * doing this, we'll also check to see if we have any invalid groups
                     */
                    var definedGroups = "";
                    var j = 0;

                    while (j < definedParameters["groups"].length && result.successful) {

                        if (typeof definedParameters["groups"][j] == "string") {
                            definedGroups += definedParameters["groups"][j] + ","
                        } else if (typeof GroupService.ReverseGroup[definedParameters["groups"][j]] !== "undefined") {
                            definedGroups += GroupService.ReverseGroup[definedParameters["groups"][j]] + ","
                        } else {
                            result = {
                                successful: false,
                                message: "Invalid group: " + definedParameters["groups"][j] + ". " + ExceptionService.explodeParameters(options),
                                data: null
                            };
                        }

                        j++;
                    }

                    if (result.successful) {
                        definedGroups = definedGroups.replace(/,$/, "");
                        definedParameters["groups"] = definedGroups;
                    }
                } else {
                    result = {
                        successful: false,
                        message: "The groups parameter must be an array of enums or strings " + ExceptionService.explodeParameters(options),
                        data: null
                    };
                }
            }

            /** If everything is fine at this point, let's go ahead and do the actual binding **/
            if (result.successful) {
                /**
                 * Here (in the first if statement) we have logic to see if we this constraint has previously been bound and if so, if we need to
                 * overwrite it with new parameters or constraint definitions.
                 *
                 * We check to see if this element-constraint combination does NOT exist. We can say that the combination does NOT exist
                 *
                 * o If the element's id does not exist as a key within the Default group (every element is added to the default group regardless). If so,
                 *   we do not need to perform any sort of overwriting behavior. We can simply verify that our parameters are good, and then attach
                 *   the constraints to the element.
                 *
                 * OR
                 *
                 * o If the element's id exists within the Default group, but this particular constraint has not been bound to it. If so, we do not need to
                 *   perform any sort of overwriting behavior. We can simply verify that our parameters are good, and then attach the constraints to the
                 *   element.
                 */

                if (!boundConstraints[GroupService.ReverseGroup[GroupService.Group.Default]][element.id] ||
                    !boundConstraints[GroupService.ReverseGroup[GroupService.Group.Default]][element.id][ConstraintService.ReverseConstraint[constraintType]]) {

                    /**
                     * definedParameters has no '__size__' property. So we need to copy all the parameters from definedParameters into another map, so that
                     * we can have a '__size__' property. The reason we need this is because we use this property to verify that this constraint definition is
                     * valid, inside the ConstraintService#verifyConstraintDefinition() function.
                     */
                    for (var param in definedParameters) if (definedParameters.hasOwnProperty(param)) {
                        MapUtils.put(newParameters, param, definedParameters[param]);
                    }

                    result = ConstraintService.verifyConstraintDefinition(element, ConstraintService.ReverseConstraint[constraintType], newParameters);

                } else if (overwriteConstraint) {
                    /**
                     * We are sure at this point that this element-constraint combination exists, and we are also sure that we are overwriting it. In this
                     * case we first need to copy all the parameters over and then verify that the definition is valid. In this case, we're simply going to
                     * overwrite the existing map of parameters with this new map. However, we will need additional logic to handle groups.
                     */

                    for (var param in definedParameters) if (definedParameters.hasOwnProperty(param)) {
                        MapUtils.put(newParameters, param, definedParameters[param]);
                    }

                    result = ConstraintService.verifyConstraintDefinition(element, ConstraintService.ReverseConstraint[constraintType], newParameters);

                    if (result.successful) {
                        /**
                         * Now we need to handle the overwriting of groups. We could delete this element-constraint combination out of
                         * all the old groups. But let's be smart about it and only delete it from the groups it no longer exists in
                         * (according to the new groups parameter). Since this is a destructive operation we only want to do this if
                         * the constraint-definition verification was successful.
                         */

                        overwriteGroups(element, constraintType, definedParameters);
                    }

                } else {
                    /**
                     * At this point, we know the following:
                     *
                     * o This constraint has previously been bound to the element because this element-constraint combination exists.
                     * o We are NOT overwriting (i.e., re-binding after getting rid of previous bindings) previously-bound constraints.
                     *
                     * Now we need to check to see if we need to overwrite previously-specified parameters. We can do one of two things
                     * next:
                     *
                     * o If the overwriteParameter flag has been set, we will need to overwrite the value of a parameter with the value
                     *   in the provided parameter map IF that parameter exists inside the existing (i.e., previously bound) parameter
                     *   map.
                     *
                     * o If the overwriteParameter flag has not been set, we will simply copy over new parameters into the existing
                     *   parameter maps and IGNORE any new parameters that conflict with existing parameters. This means that we will
                     *   maintain the old value of those parameters.
                     */

                    /** Let's get the existing parameters for this constraint **/
                    var oldParameters = boundConstraints[GroupService.ReverseGroup[GroupService.Group.Default]][element.id][ConstraintService.ReverseConstraint[constraintType]];

                    /**
                     *  Let's copy our existing parameters into the new parameter map. We'll decide later if we're going to overwrite
                     * the existing values or not, based on the overwriteParameter flag
                     */

                    for (var param in oldParameters) if (oldParameters.hasOwnProperty(param)) {
                        MapUtils.put(newParameters, param, oldParameters[param]);
                    }

                    if (overwriteParameters) {
                        /**
                         * Since overwriteParameter is true, if we find a parameter in definedParameters that already
                         * exists in oldParameters, we'll overwrite the old value with the new one. All this really
                         * entails is iterating over definedParameters and inserting the values into newParameters
                         */

                        for (var param in definedParameters) if (definedParameters.hasOwnProperty(param)) {
                            MapUtils.put(newParameters, param, definedParameters[param]);
                        }

                        result = ConstraintService.verifyConstraintDefinition(element, ConstraintService.ReverseConstraint[constraintType], newParameters);

                        if (result.successful) {
                            /**
                             * Now we need to handle the overwriting of groups. We could delete this element-constraint combination out of
                             * all the old groups. But let's be smart about it and only delete it from the groups it no longer exists in
                             * (according to the new groups parameter). Since this is a destructive operation we only want to do this if
                             * the constraint-definition verification was successful.
                             */
                            overwriteGroups(element, constraintType, newParameters);
                        }
                    } else {
                        /**
                         * Since overwriteParameter is false, we will only insert a parameter from definedParameters if it doesn't exist
                         * in oldParameters
                         */
                        for (var param in definedParameters) if (definedParameters.hasOwnProperty(param)) {
                            if (!oldParameters[param]) {
                                MapUtils.put(newParameters, param, definedParameters[param]);
                            }
                        }
                    }
                }


                if (result.successful) {
                    result = attachConstraintDefinitionToElement(element, ConstraintService.ReverseConstraint[constraintType], newParameters);
                }
            }

            return result;
        }

        /**
         * Attaches the provided constraint along with supplied parameters, to the provided element.
         * @param element - The element that we want to constraint attached to
         * @param constraintName - The name of the constraint
         * @param definedParameters - The parameters that have been provided to the constraint
         * @returns {{successful: boolean, message: string, data: null}}
         */
        function attachConstraintDefinitionToElement(element, constraintName, definedParameters) {
            var groupParamValue;

            //Regex that checks to see if Default is explicitly defined in the groups parameter
            var re = new RegExp("^" + GroupService.ReverseGroup[GroupService.Group.Default] + "$|" + "^" + GroupService.ReverseGroup[GroupService.Group.Default] + ",|," + GroupService.ReverseGroup[GroupService.Group.Default] + ",|," + GroupService.ReverseGroup[GroupService.Group.Default] + "$");

            var result = {
                successful: true,
                message: "",
                data: null
            };

            //If a "groups" parameter has not been specified, we'll create one and add "Default" to it since all elements
            //belong to the "Default" group implicitly
            if (!definedParameters["groups"]) {
                MapUtils.put(definedParameters, "groups", GroupService.ReverseGroup[GroupService.Group.Default]);
            }

            groupParamValue = definedParameters["groups"].replace(/\s/g, "");

            //If a "groups" parameter was defined, but it doesn't contain the "Default" group, we add it to groupParamValue
            //explicitly and also update the "groups" parameter for this constraint
            if (!re.test(groupParamValue)) {
                groupParamValue = GroupService.ReverseGroup[GroupService.Group.Default] + "," + groupParamValue;
                definedParameters["groups"] = groupParamValue;
            }

            var groups = groupParamValue.split(/,/);

            for (var i = 0; i < groups.length; i++) {

                var group = groups[i];

                if (!boundConstraints[group]) {

                    var newIndex = -1;

                    if (GroupService.deletedGroupIndices.length > 0) {
                        newIndex = GroupService.deletedGroupIndices.pop();
                    } else {
                        newIndex = GroupService.firstCustomGroupIndex++;
                    }

                    GroupService.Group[group] = newIndex;
                    GroupService.ReverseGroup[newIndex] = group;
                    boundConstraints[group] = {};
                }

                if (!boundConstraints[group][element.id]) {
                    boundConstraints[group][element.id] = {};
                }

                boundConstraints[group][element.id][constraintName] = definedParameters;
            }

            //If this is an HTML5 type constraint, let's make sure that the constraint doesn't conflict with the element's type
            //(if one has been specified) and let's attach the appropriate HTML5 attributes to the element
            if(ConstraintService.constraintDefinitions[constraintName].html5) {
                if(element.getAttribute("type") !== null && ConstraintService.constraintDefinitions[constraintName].inputType !== null && element.getAttribute("type") !== ConstraintService.constraintDefinitions[constraintName].inputType) {
                    result = {
                        successful: false,
                        message: ExceptionService.generateExceptionMessage(element, constraintName, "Element type of " + element.getAttribute("type") + " conflicts with type of constraint @" + constraintName + ": " + ConstraintService.constraintDefinitions[constraintName].inputType),
                        data: null
                    };
                } else {
                    //We will attach HTML5 attributes ONLY if the element doesn't have them
                    var attribute = ConstraintService.constraintDefinitions[constraintName].attribute;
                    var inputType = ConstraintService.constraintDefinitions[constraintName].inputType;

                    if((attribute !== null && element.getAttribute(attribute) === null) ||
                       (inputType !== null && element.getAttribute("type") === null)) {
                        attachHTML5Attributes(element, constraintName, definedParameters);
                    }
                }
            }

            return result;
        }

        /**
         * This function attaches HTML5 validation attributes to elements. For example, if an element has a data-constraints
         * attribute with the value "@HTML5Required @HTML5Max(value=5)", then this function will attach 'required="true"' and
         * 'max="5"' to the element. This is necessary because we delegate to the browser to perform HTML5 validation.
         *
         * @param element
         * @param constraintName
         * @param definedParameters
         */
        function attachHTML5Attributes(element, constraintName, definedParameters) {
            if(constraintName === ConstraintService.ReverseConstraint[ConstraintService.Constraint.HTML5Required]) {
                element.setAttribute("required", "true");
            } else {
                var constraint = ConstraintService.constraintDefinitions[constraintName];
                for (var i = 0; i < constraint.params.length; i++) {
                    element.setAttribute(constraint.params[i], definedParameters[constraint.params[i]]);
                }

                if(ConstraintService.constraintDefinitions[constraintName].inputType !== null) {
                    element.setAttribute("type", ConstraintService.constraintDefinitions[constraintName].inputType);
                }
            }

            var classes = element.getAttribute("class");

            if(!/regula-modified/.test(classes)) {
                element.setAttribute("class", classes + " regula-modified");
            }

        }

        /**
         * Performs unbinding. This is essentially the reverse of binding. Unbinding stops an element from being validated
         * (at all) or just being validated against a specific constraint. Unbinding behavior depends on the options provided.
         *
         * @param options
         */
        function unbind(options) {
            for (var i = 0; i < options.elements.length; i++) {
                var id = options.elements[i].id;

                var constraints = options.constraints || [];

                if (constraints.length == 0) {
                    for (var group in boundConstraints) if (boundConstraints.hasOwnProperty(group)) {

                        if (typeof boundConstraints[group][id] !== "undefined") {
                            delete boundConstraints[group][id];

                            if (group !== "Default") {
                                removeElementAndGroupFromBoundConstraintsIfEmpty(id, group);
                            }
                        } else {
                            throw new ExceptionService.Exception.IllegalArgumentException("Element with id " + id + " does not have any constraints bound to it. " + ExceptionService.explodeParameters(options));
                        }

                    }
                } else {
                    for (var j = 0; j < constraints.length; j++) {
                        var constraint = constraints[j];

                        for (var group in boundConstraints) if (boundConstraints.hasOwnProperty(group)) {

                            if (typeof boundConstraints[group][id] !== "undefined") {
                                delete boundConstraints[group][id][ConstraintService.ReverseConstraint[constraint]];

                                if (group !== "Default") {
                                    removeElementAndGroupFromBoundConstraintsIfEmpty(id, group);
                                }

                            } else {
                                throw new ExceptionService.Exception.IllegalArgumentException("Element with id " + id + " does not have any constraints bound to it. " + ExceptionService.explodeParameters(options));
                            }
                        }
                    }
                }
            }
        }

        return {
            initializeBoundConstraints: initializeBoundConstraints,
            resetBoundConstraints: resetBoundConstraints,
            getBoundConstraints: getBoundConstraints,
            removeElementAndGroupFromBoundConstraintsIfEmpty: removeElementAndGroupFromBoundConstraintsIfEmpty,
            bindAfterParsing: bindAfterParsing,
            bindHTML5ValidationConstraints: bindHTML5ValidationConstraints,
            bindFromOptions: bindFromOptions,
            unbind: unbind
        };
    })();

    regula = (function () {

        /**
         * A simple "enum" for date formats
         * @type {{DMY: string, MDY: string, YMD: string}}
         */
        var DateFormat = {
            DMY: "DMY",
            MDY: "MDY",
            YMD: "YMD"
        };

        /**
         * Function that helps configure regula's behavior
         * @param options
         */
        function configure(options) {
            MapUtils.iterateOverMap(options, function (key, value, index) {
                if (typeof config[key] !== "undefined") {
                    config[key] = value;
                }
            });
        }

        /**
         * Function that performs binding. Delegates to BindingService
         * @param options
         */
        function bind(options) {
            //console.log("in bind");

            BindingService.initializeBoundConstraints();

            var result = {
                successful: true,
                message: "",
                data: null
            };

            if (typeof options === "undefined" || !options) {
                BindingService.resetBoundConstraints();

                result = BindingService.bindAfterParsing({element: null});
                if (result.successful && config.enableHTML5Validation && DOMUtils.supportsHTML5Validation()) {
                    result = BindingService.bindHTML5ValidationConstraints({element: null});
                }
            } else {
                var elements = options.elements;

                //If "elements" has not been provided, let's assume that "element" has been provided, and call "bindFromOptions"
                if (typeof elements === "undefined" || !elements) {
                    result = BindingService.bindFromOptions(options);
                } else {
                    //console.log("OHO we have elements!!!!!");
                    //If "elements" has been provided, let's iterate over it and call bindFromOptions with each of those elements
                    var i = 0;
                    while (result.successful && i < elements.length) {

                        options.element = elements[i];
                        result = BindingService.bindFromOptions(options);

                        if (!result.successful) {
                            result.message = "regula.bind: Element " + (i + 1) + " of " + elements.length + " failed: " + result.message;
                        }

                        i++;
                    }
                }
            }

            if (!result.successful) {
                throw new ExceptionService.Exception.BindException(result.message);
            }
        }

        /**
         * Function that performs unbinding. Delegates to BindingService.
         * @param options
         */
        function unbind(options) {
            if (typeof options === "undefined" || !options) {
                BindingService.resetBoundConstraints();
            } else {
                if (typeof options.elementId === "undefined" && typeof options.elements === "undefined") {
                    throw new ExceptionService.Exception.IllegalArgumentException("regula.unbind requires an elementId attribute, or an elements attribute if options are provided");
                }

                if (typeof options.elements !== "undefined" && !(options.elements instanceof Array)) {
                    throw new ExceptionService.Exception.IllegalArgumentException("regula.unbind expects the elements attribute to be an array, if it is provided");
                }

                if (typeof options.elements === "undefined") {
                    options.elements = [document.getElementById(options.elementId)];

                    //This can happen when they pass in an id that doesn't belong to any element
                    if (options.elements[0] === null) {
                        throw new ExceptionService.Exception.IllegalArgumentException("Element with id " + options.elementId + " does not have any constraints bound to it. " + ExceptionService.explodeParameters(options));
                    }
                }

                BindingService.unbind(options);
            }
        }

        /**
         * Function that lets you override a previously-defined constraint. Delegates to ConstraintService.
         * @param options
         */
        function override(options) {
            if (!options) {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.override expects options");
            }

            if (typeof options.constraintType == "undefined") {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.override expects a valid constraintType attribute in the options argument");
            }

            var name = ConstraintService.ReverseConstraint[options.constraintType];
            if (typeof name === "undefined") {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.override: I could not find the specified constraint. Perhaps it has not been defined? Function received: " + ExceptionService.explodeParameters(options));
            } else {
                /* for custom constraints, you can override anything. for built-in constraints however, you can only override the default message */
                var formSpecific = ConstraintService.constraintDefinitions[name].formSpecific;
                if (ConstraintService.constraintDefinitions[name].custom) {
                    formSpecific = (typeof options.formSpecific === "undefined") ? ConstraintService.constraintDefinitions[name].formSpecific : options.formSpecific;
                }

                var validator = ConstraintService.constraintDefinitions[name].custom && !ConstraintService.constraintDefinitions[name].compound ? options.validator || ConstraintService.constraintDefinitions[name].validator : ConstraintService.constraintDefinitions[name].validator;
                var params = ConstraintService.constraintDefinitions[name].custom ? options.params || ConstraintService.constraintDefinitions[name].params : ConstraintService.constraintDefinitions[name].params;
                var defaultMessage = options.defaultMessage || ConstraintService.constraintDefinitions[name].defaultMessage;
                var compound = ConstraintService.constraintDefinitions[name].compound;
                var composingConstraints = options.constraints || ConstraintService.constraintDefinitions[name].constraints;

                if (typeof formSpecific != "boolean") {
                    throw new ExceptionService.Exception.IllegalArgumentException("regula.override expects the formSpecific attribute in the options argument to be a boolean");
                }

                if (typeof validator != "function") {
                    throw new ExceptionService.Exception.IllegalArgumentException("regula.override expects the validator attribute in the options argument to be a function");
                }

                if (!(params instanceof Array)) {
                    throw new ExceptionService.Exception.IllegalArgumentException("regula.override expects the params attribute in the options argument to be an array");
                }

                if (typeof defaultMessage != "string") {
                    throw new ExceptionService.Exception.IllegalArgumentException("regula.override expects the defaultMessage attribute in the options argument to be a string");
                }

                ConstraintService.override({
                    formSpecific: formSpecific,
                    name: name,
                    constraintType: options.constraintType,
                    compound: compound,
                    params: params,
                    composingConstraints: composingConstraints,
                    defaultMessage: defaultMessage,
                    validator: validator
                });
            }
        }

        /**
         * Function that helps you define a custom constraint. Delegates to ConstraintService.
         * @param options
         */
        function custom(options) {
            if (!options) {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.custom expects options");
            }

            var name = options.name;
            var formSpecific = options.formSpecific || false;
            var validator = options.validator;
            var params = options.params || [];
            var defaultMessage = options.defaultMessage || "";

            /* handle attributes. throw exceptions if they are not sane */

            /* name attribute*/
            if (!name) {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.custom expects a name attribute in the options argument");
            } else if (typeof name != "string") {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.custom expects the name attribute in the options argument to be a string");
            } else if (name.replace(/\s/g, "").length == 0) {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.custom cannot accept an empty string for the name attribute in the options argument");
            }

            /* formSpecific attribute */
            if (typeof formSpecific != "boolean") {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.custom expects the formSpecific attribute in the options argument to be a boolean");
            }

            /* validator attribute */
            if (!validator) {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.custom expects a validator attribute in the options argument");
            } else if (typeof validator != "function") {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.custom expects the validator attribute in the options argument to be a function");
            }

            /* params attribute */
            if (params.constructor.toString().indexOf("Array") < 0) {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.custom expects the params attribute in the options argument to be an array");
            }

            /* defaultMessage attribute */
            if (typeof defaultMessage != "string") {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.custom expects the defaultMessage attribute in the options argument to be a string");
            }

            if (ConstraintService.constraintDefinitions[name]) {
                throw new ExceptionService.Exception.IllegalArgumentException("There is already a constraint called " + name + ". If you wish to override this constraint, use regula.override");
            } else {
                ConstraintService.custom({
                    name: name,
                    formSpecific: formSpecific,
                    validator: validator,
                    custom: true,
                    compound: false,
                    params: params,
                    defaultMessage: defaultMessage
                });
            }
        }

        /**
         * Function that helps you define a compound constraint. Delegates to ConstraintService.
         * @param options
         */
        function compound(options) {
            if (!options) {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.compound expects options");
            }

            var name = options.name;
            var constraints = options.constraints || [];
            var formSpecific = options.formSpecific || false;
            var defaultMessage = options.defaultMessage || "";
            var params = options.params || [];
            var reportAsSingleViolation = typeof options.reportAsSingleViolation === "undefined" ? false : options.reportAsSingleViolation;

            if (!name) {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.compound expects a name attribute in the options argument");
            }

            if (typeof name != "string") {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.compound expects name to be a string parameter");
            }

            /* params attribute */
            if (params.constructor.toString().indexOf("Array") < 0) {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.compound expects the params attribute in the options argument to be an array");
            }

            if (constraints.length == 0) {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.compound expects an array of composing constraints under a constraints attribute in the options argument");
            }

            if (ConstraintService.constraintDefinitions[name]) {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.compound: There is already a constraint called " + name + ". If you wish to override this constraint, use regula.override");
            }

            ConstraintService.compound({
                name: name,
                formSpecific: formSpecific,
                params: params,
                reportAsSingleViolation: reportAsSingleViolation,
                constraints: constraints,
                defaultMessage: defaultMessage
            });
        }

        /**
         * Function that performs constraint validation on bound elements.
         * @param options
         * @returns {Array} of constraint violations.
         */
        function validate(options) {
            var result = [];

            if (typeof options !== "undefined" && typeof options.groups !== "undefined" && !(options.groups instanceof Array)) {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.validate: If a groups attribute is provided, it must be an array.");
            }

            if (typeof options !== "undefined" && typeof options.groups !== "undefined" && options.groups.length == 0) {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.validate: If a groups attribute is provided, it must not be empty.");
            }

            if (typeof options !== "undefined" && options.hasOwnProperty("constraintType") && typeof options.constraintType === "undefined") {
                throw new ExceptionService.Exception.IllegalArgumentException("regula.validate: If a constraintType attribute is provided, it cannot be undefined.");
            }

            if (typeof options !== "undefined" && typeof options.elements !== "undefined") {

                if (options.elements instanceof Array) {

                    if (options.elements.length == 0) {
                        throw new ExceptionService.Exception.IllegalArgumentException("regula.validate: If an elements attribute is provided, it must not be empty.");
                    }

                    /*
                     Since we redefine options.constraintType and options.groups in ValidationService.validate(), we need to preserve their original values so that
                     we can use them on each run
                     */

                    var originalConstraintType = options.constraintType;
                    var originalGroups = options.groups;

                    result = [];
                    for (var i = 0; i < options.elements.length; i++) {
                        options.elementId = options.elements[i].id;

                        result = result.concat(ValidationService.validate(options));

                        options.constraintType = originalConstraintType;
                        options.groups = originalGroups;
                    }
                } else {
                    throw new ExceptionService.Exception.IllegalArgumentException("regula.validate: If an elements attribute is provided, it must be an array.");
                }
            } else {

                result = ValidationService.validate(options);
            }

            return result;
        }

        return {
            configure: configure,
            bind: bind,
            unbind: unbind,
            validate: validate,
            custom: custom,
            compound: compound,
            override: override,
            Constraint: ConstraintService.Constraint,
            Group: GroupService.Group,
            DateFormat: DateFormat,
            Exception: ExceptionService.Exception
        };
    })();

    return regula;
}));