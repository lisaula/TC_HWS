const parser = require('./regular-expression');
let output = parser.parse('(1+2).2*');
console.log(JSON.stringify(output));
