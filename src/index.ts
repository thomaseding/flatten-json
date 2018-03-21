import fs from "fs"


function getStdIn(): string
{
    var buffer = fs.readFileSync(0);
    return buffer.toString();
}


console.log(getStdIn());

