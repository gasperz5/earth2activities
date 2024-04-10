// @name         List Jewel Buyers
// @version      0.1.1
// @description  This script will read the file and list the buyers of jewels and the amount of jewels they bought.
// @author       GasperZ5 -- gasperz (Discord) -- gasper (7.5% code for E2)
// @support      https://www.buymeacoffee.com/gasper

const fs = require('fs');
const { argv } = require('process');
if (argv.length < 3) {
    console.log('Usage: node jewel-buyers.js <file-name> [file-name] ...');
    process.exit(1);
}

for (let i = 2; i < argv.length; i++) {
    console.log(`\nFile: ${argv[i]}`);

    const fileName = argv[i];
    const file = fs.readFileSync(fileName, 'utf8');
    const lines = file.split('\r\n');
    let buyers = {};

    let count = 0;

    let objects = [];


    for (let index = 0; index < lines.length - 1; index++) {
        const element = JSON.parse(lines[index]);
        if (element.data.activity_type !== 'JEWEL_BOUGHT') {
            continue;
        }

        let buyer = element.data.data.buyer? element.data.data.buyer.username :'anonymous';
        let seller = element.data.data.seller? element.data.data.seller.username: 'anonymous';
        let price = parseFloat(element.data.data.price) || 0;
        let name = element.data.data.jewel.name;

        objects.push({ buyer, seller, price, element, name });

        if (!buyers[buyer]) {
            buyers[buyer] = { count: 0, id: element.data.data.buyer?element.data.data.buyer.id : 'anonymous', price: 0 };
        }
        buyers[buyer].count++;
        count++;
        buyers[buyer].price += price;
    }

    let buyersArray = Object.entries(buyers);
    buyersArray.sort((a, b) => b[1].count - a[1].count);


    console.log(`Total jewels bought: ${count}`);

    for (let index = 0; index < min(10, buyersArray.length); index++) {
        const element = buyersArray[index];
        console.log(`${element[1].count}: ${(element[1].price).toFixed(2)} : ${element[0]}: id: ${element[1].id}`);
    }

    objects.sort((a, b) => b.price - a.price);

    console.log(`--- Top 10 most expensive jewels bought ---`);

    for (let index = 0; index < min(10, objects.length); index++) {
        const element = objects[index];
        console.log(`${element.price.toFixed(2)} : ${element.buyer}: ${element.seller} : ${element.name}`);
    }

    function min(a, b) {
        return a < b ? a : b;
    }

}