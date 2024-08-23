// @name         Get Daily activities by hour
// @version      0.1.0
// @description  This script will read the file and make a chart
// @author       GasperZ5 -- gasperz (Discord) -- gasper (7.5% code for E2)
// @support      https://www.buymeacoffee.com/gasper

const fs = require('fs');
const { argv } = require('process');
if (argv.length != 3) {
    console.log('Usage: node daily-activities.js <file-name>');
    process.exit(1);
}
let hours = {};

console.log(`\nFile: ${argv[2]}`);
const fileName = argv[2];
const file = fs.readFileSync(fileName, 'utf8');
const lines = file.split('\r\n');
let objects = [];
let hourly = [];

for (let index = 0; index < lines.length - 1; index++) {
    try {
        element = JSON.parse(lines[index]);
        objects.push(element);
        const hour = parseInt(element.data.created_at.substring(11, 13) || -1);
        if (!hours[hour]) {
            hours[hour] = { count: 0 };
        }
        hours[hour].count++;
    } catch (e) {

    }
}

function visualizeHours(hours) {
    let chart = "";
    for (let i = 23; i >= 0; i--) {
        const count = hours[i] ? hours[i].count : 0;
        chart += `${i}: ${count}\n`;
    }
    return chart;
}

const chartString = visualizeHours(hours);
console.log(chartString);
