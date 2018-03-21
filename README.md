# flatten-json
Flattens the object structure of an input JSON object.

This is a command-line tool that accepts a single JSON string as input via stdin. The tool then emits a flattened object structure representing the input JSON object. Each property key of the flattened structure represents a full path to terminal values of the input JSON. The property keys are constructed by joining the keys from the path required to reach the terminal value. The joined keys are each separated by a '.' character.

Assumptions about the input JSON data:
* The JSON root is an object.
* All property keys may not contain the '.' character.
* No arrays may be present anywhere in the JSON structure.

Local build steps:
* Install node and npm
* Clone repository
* cd into repository root directory
* $ npm run build

Example command line usage from the project's root directory:
```
cmd.exe
> echo { "a": { "x": 1 }, "b": { "y": 2 } } | node dist/index.js

bash
$ echo '{ "a": { "x": 1 }, "b": { "y": 2 } }' | node dist/index.js
```

