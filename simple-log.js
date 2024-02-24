// @name         Simple Log
// @version      0.1.1
// @description  Simple log for earth2.io activities
// @author       GasperZ5 -- gasperz (Discord) -- gasper (7.5% code for E2)
// @support      https://www.buymeacoffee.com/gasper

const Centrifuge = require('centrifuge');
global.WebSocket = require('ws');
const fs = require('fs');

const centrifuge = new Centrifuge('wss://rtc.earth2.io/connection/websocket', {
    debug: true
});

async function start() {
    const IGNORE = ["DROID_RAID_LAUNCHED","DROIDS_CHARGING","DROID_DISPENSED_ETHER","DROID_BOUGHT","JEWEL_COLLECTED","CIVILIAN_BOUGHT","CIVILIAN_LEVEL_UP","CIVILIANS_SYNTHESIS_FINISHED","RESOURCE_CLAIM_VALIDATED","DROIDS_BUILT","DROIDS_POWERED","CIVILIANS_SYNTHESIS_STARTED","JEWEL_CRAFTED","DROIDS_DEPOWERED","DROIDS_RELOCATE_STARTED","DROIDS_RELOCATED","ETHER_CLAIMED","ESSENCE_GENERATED"];

    async function handleMessage(message) {
        if (IGNORE.includes(message.data.activity_type)) return;

        fs.appendFileSync(`/home/gasperz/Dokumenti/activities/logs/${message.data.created_at.substring(0,10)}.log`, JSON.stringify(message) + '\r\n');
    }

    centrifuge.subscribe('activity-feed', handleMessage);

    centrifuge.connect();
}

start();
