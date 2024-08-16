// @name         Get User Count
// @version      0.1.0
// @description  This script will read the file and print the number of users
// @author       GasperZ5 -- gasperz (Discord) -- gasper (7.5% code for E2)
// @support      https://www.buymeacoffee.com/gasper

const fs = require('fs');
const { argv } = require('process');
if (argv.length < 3) {
    console.log('Usage: node get-user-count.js <file-name> [file-name] ...');
    process.exit(1);
}
let useridtypes = ['ETHER_CLAIMED','ESSENCE_GENERATED','HOLOBUILDING_CREATED','GIFT_CLAIMED','T3_VOTE_SUBMITTED','EPL_PURCHASED','GIFT_PURCHASED','RESOURCE_CLAIM_APPROVED','EPL_RENAMED','RESOURCE_CLAIM_CREATED','RESOURCE_CLAIM_UNDER_INVESTIGATION',
'DROID_FUSED','LANDFIELD_TIER_UPGRADE','RESOURCE_CLAIM_REJECTED','PAYOUT_WITHDRAWN_TO_ESS'];

let buyersellertypes = ['EXISTING_LANDFIELD_BOUGHT','BID_PLACED','BID_DECLINED','JEWEL_BOUGHT','BID_ACCEPTED','BLUEPRINT_BOUGHT','DROID_BOUGHT','CIVILIAN_BOUGHT'];
let buyertypes = ['NEW_LANDFIELD_BOUGHT','AVATAR_BOUGHT','AVATAR_GIFT_BOUGHT'];
let sellertypes = ['BLUEPRINT_PLACED_TO_BAZAAR'];
let validationtypes = ['RESOURCE_CLAIM_VALIDATION_COMPLETE'];

let user_ids = new Set();
let itemsWithUsername = 0;
let itemsWithoutUsername = 0;

for (let i = 2; i < argv.length; i++) {
    console.log(`\nFile: ${argv[i]}`);
    const fileName = argv[i];
    const file = fs.readFileSync(fileName, 'utf8');
    const lines = file.split('\r\n');
    let objects = [];

    for (let index = 0; index < lines.length - 1; index++) {
        try{
            const element = JSON.parse(lines[index]);
            objects.push(element);
            const type = element.data.activity_type;
            if (useridtypes.includes(type)){
                if(element.data.data?.anonymous){
                    itemsWithoutUsername++;
                }else{
                    if (element.data.data.user?.id) {
                        user_ids.add(element.data.data.user.id)
                        itemsWithUsername++;
                    }else{
                        itemsWithoutUsername++;
                    }
                }
            }else if(buyersellertypes.includes(type)){
                if(element.data.data?.anonymous){
                    itemsWithoutUsername+=2;
                }else{
                    if (element.data.data.seller?.id) {
                        user_ids.add(element.data.data.seller.id)
                        itemsWithUsername++;
                    }else{
                        itemsWithoutUsername++;
                    }
                    if (element.data.data.buyer?.id) {
                        user_ids.add(element.data.data.buyer.id)
                        itemsWithUsername++;
                    }else{
                        itemsWithoutUsername++;
                    }
                }
            }else if(buyertypes.includes(type)){
                if(element.data.data?.anonymous){
                    itemsWithoutUsername++;
                }else{
                    if (element.data.data.buyer?.id) {
                        user_ids.add(element.data.data.buyer.id)
                        itemsWithUsername++;
                    }else{
                        itemsWithoutUsername++;
                    }
                }
            }else if(sellertypes.includes(type)){
                if(element.data.data?.anonymous){
                    itemsWithoutUsername++;
                }else{
                    if (element.data.data.seller?.id) {
                        user_ids.add(element.data.data.seller.id)
                        itemsWithUsername++;
                    }else{
                        itemsWithoutUsername++;
                    }
                }
            }else if(validationtypes.includes(type)){
                if(element.data.data?.anonymous){
                    itemsWithoutUsername+=2;
                }else{
                    if (element.data.data.validating_user?.id) {
                        user_ids.add(element.data.data.validating_user.id)
                        itemsWithUsername++;
                    }else{
                        itemsWithoutUsername++;
                    }
                    if (element.data.data.validating_user?.id) {
                        user_ids.add(element.data.data.validating_user.id)
                        itemsWithUsername++;
                    }else{
                        itemsWithoutUsername++;
                    }
                }
            }else{
                console.log(element);
            }
        }catch (e) {
            console.log(e)
        }
    }

}

let total = user_ids.size;

console.log('Unique users:', total);
console.log('Transactions with users:', itemsWithUsername);
console.log('Transactions without users:', itemsWithoutUsername);

//estimated total price of all items
console.log('Estimated total users:', total/itemsWithUsername*(itemsWithUsername+itemsWithoutUsername));
