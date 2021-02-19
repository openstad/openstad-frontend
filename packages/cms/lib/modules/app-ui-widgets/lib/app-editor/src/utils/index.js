exports.capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);
exports.makeCamelCasePretty = (str) => {
    var output = "";
    var len = str.length;
    var char;

    for (var i = 0; i < len; i++) {
        char = str.charAt(i);

        if (i === 0) {
            output += char.toUpperCase();
        } else if (char !== char.toLowerCase() && char === char.toUpperCase()) {
            output += " " + char;
        } else if (char === "-" || char === "_") {
            output += " ";
        } else {
            output += char;
        }
    }

    return output;
}

