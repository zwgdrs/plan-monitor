function insertCSS(rule) {
    if (document.styleSheets && document.styleSheets.length) {
        try {
            document.styleSheets[0].insertRule(rule, 0);
        }
        catch (ex) {
            console.warn(ex.message, rule);
        }
    }
    else {
        var style = document.createElement("style");
        style.innerHTML = rule;
        document.head.appendChild(style);
    }
    return
}

function deleteCSS(ruleName) {
    const cssrules = (document.all) ? "rules" : "cssRules"

    for(let i = 0; i < document.styleSheets[0][cssrules].length; i += 1) {
        var rule = document.styleSheets[0][cssrules][i];
        if (rule.name === ruleName || rule.selectorText === '.'+ruleName) {
            document.styleSheets[0].deleteRule(i);
            if (this.debug) {
                console.log("Deleted keyframe: " + ruleName);
            }
            break
        }
    }
    return
}

export default {
    insertCSS,
    deleteCSS,
}