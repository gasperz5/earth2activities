// @name         Get Types
// @version      0.1.1
// @description  This script will read the file and print the types of activities and their count
// @author       GasperZ5 -- gasperz (Discord) -- gasper (7.5% code for E2)
// @support      https://www.buymeacoffee.com/gasper

const fs = require('fs');
const { argv } = require('process');
if (argv.length < 3) {
    console.log('Usage: node get-types.js <file-name> [file-name] ...');
    process.exit(1);
}
let types = {};

for (let i = 2; i < argv.length; i++) {
    console.log(`\nFile: ${argv[i]}`);
    const fileName = argv[i];
    const file = fs.readFileSync(fileName, 'utf8');
    const lines = file.split('\r\n');
    let objects = [];

    for (let index = 0; index < lines.length - 1; index++) {
        try{
            element = JSON.parse(lines[index]);
            objects.push(element);
            if (!types[element.data.activity_type]) {
                types[element.data.activity_type] = { count: 0 };
            }
            types[element.data.activity_type].count++;
        }catch (e) {

        }
    }

}

for (const key in types) {
    console.log(key, '-', types[key].count);
}