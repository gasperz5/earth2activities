// @name         Skin Counts
// @version      0.1.0
// @description  This script will read the files and print the counts of skins bought and gift codes bought
// @author       GasperZ5 -- gasperz (Discord) -- gasper (7.5% code for E2)
// @support      https://www.buymeacoffee.com/gasper

const fs = require('fs');
/*
The timestamp is there to measure the time in milliseconds from the start of the skin drop - releaseAt attribute from the skin store API - only available while the skin is in the store
const meta = { startTimestamp: new Date('2024-02-14T07:00:00.000Z'), files:['2024-02-14.log','2024-02-15.log'], drop: 'Cupid\'s Cleaner' };
const meta = { startTimestamp: new Date('2024-02-12T22:45:00.000Z'), files: ['2024-02-12.log', '2024-02-13.log'], drop: 'Casual Cupid' };
*/
const meta = { startTimestamp: new Date('2024-02-24T08:00:00.000Z'), files: ['2024-02-24.log', '2024-02-25.log'], drop: 'Horror Warning' }


const labels = {
    AVATAR_GIFT_BOUGHT: 'gifted',
    AVATAR_BOUGHT: 'bought',
    total: 'total',
};

let max = 1;
let counts = {};
let objects = [];
for (let index = 0; index < meta.files.length; index++) {
    if (!fs.existsSync('../logs/' + meta.files[index])) {
        console.log('File does not exist:', meta.files[index]);
        continue;
    }
    const file = fs.readFileSync('../logs/' + meta.files[index], 'utf8');
    const lines = file.split('\r\n').slice(0, -1);
    for (let index = 0; index < lines.length; index++) {
        const element = JSON.parse(lines[index]);
        if ('AVATAR_GIFT_BOUGHT' !== element.data.activity_type && 'AVATAR_BOUGHT' !== element.data.activity_type) {
            continue;
        }
        if (element.data.data.quantity > max) {
            max = element.data.data.quantity;
        }
        if (!counts[element.data.data.name]) {
            counts[element.data.data.name] = {};
        }
        if (counts[element.data.data.name][element.data.activity_type]) {
            counts[element.data.data.name][element.data.activity_type] += element.data.data.quantity;
        } else {
            counts[element.data.data.name][element.data.activity_type] = element.data.data.quantity;
        }
        objects.push(element);
    }
}

objects = objects.map((e) => {
    let time = new Date(e.data.created_at);
    e.time = time - meta.startTimestamp;
    let name = e.data?.data?.name || 'unknown';
    let buyer = e.data?.data?.buyer?.username || 'noname';
    e.name = name;
    e.buyer = buyer;
    return e;
});
let sum = 0;
let longest = 0;
for (const key in counts) {
    if (key.length > longest) {
        longest = key.length;
    }
    if (Object.hasOwnProperty.call(counts, key)) {
        const element = counts[key];
        const total = [element['AVATAR_GIFT_BOUGHT'], element['AVATAR_BOUGHT']].reduce((a, b) => a + b, 0);
        sum += total;
        counts[key].total = total;
    }
}
for (const key in counts) {
    let line = key.padEnd(longest + 2, ' ') + ' - ';
    for (const key2 in counts[key]) {
        line += labels[key2] + ' : ' + counts[key][key2] + ', ';
    }
    console.log(line);
}
console.log('There was a total of', sum, 'skins bought', 'with a maximum of', max, 'skins bought at once', 'from', objects.length, 'transactions');

/*
let csv = 'time,name,buyer,quantity\n';
for (let index = 0; index < objects.length; index++) {
    const element = objects[index];
    csv += `${element.time},${element.name},${element.buyer},${element.data.data.quantity}\n`;
}
fs.writeFileSync('skin_data.csv', csv);
*/