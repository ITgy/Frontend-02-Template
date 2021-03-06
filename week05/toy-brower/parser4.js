const css = require("css");
const layout = require("./layout2.js");

const EOF = Symbol("EOF");

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

let stack = [{ type: "document", children: [] }]

let rules = [];

function addCSSRule(content) {
    let ast = css.parse(content);
    rules.push(...ast.stylesheet.rules);
    console.log(rules);
}

function match(element, selector) {
    if (!element.attributes || !selector) {
        return false;
    }
    if (selector.charAt(0) === '#') {
        let attr = element.attributes.filter(attr => attr.name === "id")[0];
        if (attr && attr.value === selector.replace('#', '')) {
            return true;
        }
    } else if (selector.charAt(0) === '.') {
        let attr = element.attributes.filter(attr => attr.name === "class")[0];
        if (attr && attr.value === selector.replace('.', '')) {
            return true;
        }
    } else {
        if (element.tagName === selector) {
            return true;
        }
    }
    return false;
}

function specificity(selectors) {
    let p = [0, 0, 0, 0];
    for (let selector of selectors.split(" ")) {
        if (selector.charAt(0) === "#") {
            p[1] += 1;
        } else if (selector.charAt(0) === ".") {
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }
    return p;
}

function compare(sp1, sp2) {
    if (sp1[0] - sp2[0]) {
        return sp1[0] - sp2[0]
    } else if (sp1[1] - sp2[1]) {
        return sp1[1] - sp2[1]
    } else {
        return sp1[2] - sp2[2]
    }
    return sp1[3] - sp2[3]
}

function computedCSS(element) {
    let elements = stack.slice().reverse();
    if (!element.computedStyle) {
        element.computedStyle = {};
    }

    for (let rule of rules) {
        let selectorPart = rule.selectors[0].split(" ").reverse();
        if (!match(element, selectorPart[0])) {
            continue;
        }

        let matched = false;

        let j = 1;

        for (let i = 0; i < selectorPart.length; i++) {
            if (match(elements[i], selectorPart[j])) {
                j++;
            }
        }

        if (j >= selectorPart.length) {
            matched = true;
        }
        if (matched) {
            let sp = specificity(rule.selectors[0]);
            let computedStyle = element.computedStyle;
            for (let declaration of rule.declarations) {
                if (declaration.property.indexOf("-") !== -1) {
                    let char = declaration.property.match(/-[a-z]/g)[0][1];
                    declaration.property = declaration.property.replace(/-[a-z]/, char.toUpperCase());
                }
                if (!computedStyle[declaration.property]) {
                    computedStyle[declaration.property] = {};
                }
                if (!computedStyle[declaration.property].specificity) {
                    computedStyle[declaration.property].specificity = sp;
                } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
                    computedStyle[declaration.property].specificity = sp;
                }
                computedStyle[declaration.property].value = declaration.value;
            }
        }
    }
}

function emit(token) {
    let top = stack[stack.length - 1];
    if (token.type === "startTag") {
        let element = {
            type: "element",
            tagName: token.tagName,
            children: [],
            attributes: []
        }

        for (let p in token) {
            if (p !== "type" && p !== "tagName" && p !== "isSelfClosing") {
                element.attributes.push({
                    name: p,
                    value: token[p]
                })
            }
        }

        computedCSS(element);

        top.children.push(element);

        if (!token.isSelfClosing) {
            stack.push(element);
        }
        currentTextNode = null;
    } else if (token.type === "endTag") {
        if (top.tagName !== token.tagName) {
            throw new Error("开始标签名与结束标签名不符");
        } else {
            if (top.tagName === 'style') {
                addCSSRule(top.children[0].content);
            }
            layout(top);
            stack.pop();
        }
    } else if (token.type === "text") {
        if (currentTextNode === null) {
            currentTextNode = {
                type: "text",
                content: ""
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}

function data(c) {
    if (c === "<") {
        return tagOpen;
    } else if (c === EOF) {
        emit({
            type: "EOF"
        })
        return;
    } else {
        emit({
            type: "text",
            content: c
        })
        return data;
    }
}

function tagOpen(c) {
    if (c === "/") {
        return endTagOpen;
    } else {
        currentToken = {
            type: "startTag",
            tagName: ""
        }
        return tagName(c);
    }
}

function tagName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c === "/") {
        return selfClosingStartTag;
    } else if (c === ">") {
        emit(currentToken);
        return data;
    } else {
        currentToken.tagName += c;
        return tagName;
    }
}

function beforeAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === "/") {
        return selfClosingStartTag;
    } else {
        currentAttribute = {
            name: "",
            value: ""
        }
        return attributeName(c);
    }
}

function attributeName(c) {
    if (c === "=") {
        return afterAttributeName;
    } else if (c.match(/^[\f\n\t ]$/)) {
        currentAttribute.value = currentAttribute.name;
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (c === "/") {
        currentAttribute.value = currentAttribute.name;
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}

function afterAttributeName(c) {
    if (c.match(/^[\f\n\t ]$/)) {
        return afterAttributeName;
    } else if (c === "\"") {
        return doubleQuoteAttributeValue;
    } else if (c === "\'") {
        return singleQuoteAttributeValue;
    } else {
        return UnquoteAttributeValue(c);
    }
}

function doubleQuoteAttributeValue(c) {
    if (c === "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterAttributeValue;
    } else {
        currentAttribute.value += c;
        return doubleQuoteAttributeValue;
    }
}

function singleQuoteAttributeValue(c) {
    if (c === "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterAttributeValue;
    } else {
        currentAttribute.value += c;
        return singleQuoteAttributeValue;
    }
}

function UnquoteAttributeValue(c) {
    if (c === "/" || c === ">") {
        return afterAttributeValue(c);
    } else if (c.match(/^[\f\n\t ]$/)) {
        return beforeAttributeName;
    } else {
        currentAttribute.value += c;
        return UnquoteAttributeValue;
    }
}

function afterAttributeValue(c) {
    if (c.match(/^[\f\n\t ]$/)) {
        return beforeAttributeName;
    } else if (c === "/") {
        return selfClosingStartTag;
    } else if (c === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }
}

function selfClosingStartTag(c) {
    if (c === ">") {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    }
}

function endTagOpen(c) {
    if (c.match(/^[\f\n\t ]$/)) {
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName: ""
        }
        return tagName(c);
    }
}

module.exports.parseHTML = function(html) {
    let state = data;
    for (let c of html) {
        state = state(c);
    }
    state = state(EOF);
    console.log(stack)
    return stack[0]
}