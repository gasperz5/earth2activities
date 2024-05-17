// @name         Month Report
// @version      0.1.1
// @description  This script will compile and prosess the data from the activity logs and print the counts of each activity type and the stats about them such as predicted sales...
// @author       GasperZ5 -- gasperz (Discord) -- gasper (7.5% code for E2)
// @support      https://www.buymeacoffee.com/gasper

const fs = require('fs');
const { argv } = require('process');
if (argv.length < 3) {
    console.log('Usage: node get-types.js <file-name> [file-name] ...');
    process.exit(1);
}

let all = [];
let types = {};
let priceTotal = 0;
let itemsWithPrice = 0;
let itemsWithoutPrice = 0;
let jewelTypes = {};

for (let i = 2; i < argv.length; i++) {
    const fileName = argv[i];
    const file = fs.readFileSync(fileName, 'utf8');
    const lines = file.split('\r\n');

    for (let index = 0; index < lines.length - 1; index++) {
        let element;
	try {
	    element = JSON.parse(lines[index]);
	} catch {
	    continue;
	}

	    all.push(element);
        if (!types[element.data.activity_type]) {
            types[element.data.activity_type] = { count: 0 };
        }
        types[element.data.activity_type].count++;
        if (element.data.activity_type === 'JEWEL_BOUGHT') {

            if (element.data.data.price) {
                priceTotal += parseFloat(element.data.data.price);
                itemsWithPrice++;
            }else { 
                itemsWithoutPrice++;
            }

           if (!jewelTypes[element.data.data.jewel.color_name+'-'+element.data.data.jewel.level]) {
                jewelTypes[element.data.data.jewel.color_name+'-'+element.data.data.jewel.level] = { count: 0 };            
           }
              jewelTypes[element.data.data.jewel.color_name+'-'+element.data.data.jewel.level].count++;
        }
    }

}

console.log('Total:', all.length);
const keys = Object.keys(types);
for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    console.log(key, types[key].count);
}

console.log('Jewels:');
const jewelKeys = Object.keys(jewelTypes);
for (let index = 0; index < jewelKeys.length; index++) {
    const key = jewelKeys[index];
    console.log(key, jewelTypes[key].count);
}

console.log('Price total:', priceTotal);
console.log('Items with price:', itemsWithPrice);
console.log('Items without price:', itemsWithoutPrice);

//estimated total price of all items
console.log('Estimated total price:', priceTotal/itemsWithPrice*itemsWithoutPrice+priceTotal);
