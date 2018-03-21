import fs from "fs"


function getStdIn()
    : string
{
    var buffer = fs.readFileSync(0);
    return buffer.toString();
}


function isObject(
    x: any)
    : boolean
{
    return x && typeof x === "object";
}


function isArray(
    x: any)
    : x is Array<any>
{
    // I know [[Array.isArray]] exists, but I'm not sure about its portability.
    // Creating a poor-man's implementation
    return x && x.constructor === Array;
}


function walkRecursive(
    curr: any,
    propChain: string[],
    outObj: any)
    : void
{
    if (isObject(curr)) {
        const props = Object.keys(curr);
        for (const prop of props) {
            if (prop.indexOf(".") >= 0) {
                throw new Error(`Expected input JSON property keys to not contain the character (".").`);
            }

            propChain.push(prop);

            const value = curr[prop];
            walkRecursive(value, propChain, outObj);

            propChain.pop();
        }
    }
    else {
        if (isArray(curr)) {
            throw new Error("Expected input JSON to not contain any arrays.");
        }

        // [[curr]] guaranteed is a string, number, boolean, or null here.
        // Hence [[curr]] is a terminal value.

        const pathProp = propChain.join(".");
        outObj[pathProp] = curr;
    }
}


function flattenObject(
    obj: any)
    : any
{
    if (!obj || typeof obj !== "object" || isArray(obj)) {
        throw new Error("Expected input JSON to be an object.");
    }

    const flattenedObj = {};
    walkRecursive(obj, [], flattenedObj);
    return flattenedObj;
}


function hexEscapeChar(
    c: string)
    : string
{
    console.assert(c.length === 1);

    const code = c.codePointAt(0)!;
    const hex = code.toString(16);

    return `\\x${hex}`;
}


function escapeString(
    str: string)
    : string
{
    const parts: string[] = [];

    for (const c of str) {
        if (c < " " || c > "~") {
            parts.push(hexEscapeChar(c));
        }
        else if (c === `"`) {
            parts.push(`\\"`);
        }
        else {
            parts.push(c);
        }
    }

    return parts.join("");
}


function formatEntry(
    prop: string,
    value: any)
{
    const escapedProp = escapeString(prop);
        
    let entryStr = `"${escapedProp}": `;

    if (typeof value === "string") {
        const escapedVal = escapeString(value);
        entryStr += `"${escapedVal}"`;
    }
    else {
        entryStr += `${value}`;
    }

    return entryStr;
}


function prettyPrintFlattenedObject(
    flatObj: any)
    : void
{
    console.log("{");

    const props = Object.keys(flatObj);

    for (let i = 0; i < props.length; ++i) {
        const prop = props[i];
        const value = flatObj[prop];

        console.assert(!isObject(value));
        console.assert(!isArray(value));

        const entryStr = formatEntry(prop, value);
        const comma = i === props.length - 1 ? "" : ",";

        console.log(`\t${entryStr}${comma}`);
    }

    console.log("}");
}


function main()
    : never
{
    const jsonString = getStdIn();

    let parsedObj: any;
    let flattenedObj: any;

    try {
        parsedObj = JSON.parse(jsonString);
        flattenedObj = flattenObject(parsedObj);
    }
    catch (e) {
        console.log(e.message);
        return process.exit(1);
    }

    prettyPrintFlattenedObject(flattenedObj);

    return process.exit(0)
}


main();

