// @name         Discord bot for skins
// @version      0.1.4
// @description  Simple log for earth2.io activities
// @author       GasperZ5 -- gasperz (Discord) -- gasper (7.5% code for E2)
// @support      https://www.buymeacoffee.com/gasper

const Centrifuge = require('centrifuge');
global.WebSocket = require('ws');
const fs = require('fs');
const { Client, GatewayIntentBits } = require("discord.js");

require('dotenv').config();
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const STATS_DISCORD_CHANNEL_ID = process.env.STATS_DISCORD_CHANNEL_ID;
const ANNOUNCE_DISCORD_CHANNEL_ID = process.env.ANNOUNCE_DISCORD_CHANNEL_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
client.login(DISCORD_TOKEN);


let isRunning = false;


let skin_names = require('./skin_names.json');
let bulkNotification = {};

let skin_stats = {
}


const FOLDER_PATH = './dis-logs/';

if (!fs.existsSync(FOLDER_PATH)) {
    fs.mkdirSync(FOLDER_PATH);
    console.log('Folder created');
}

const centrifuge = new Centrifuge('wss://rtc.earth2.io/connection/websocket', {
    debug: true
});

async function start() {

    console.log(DISCORD_TOKEN, STATS_DISCORD_CHANNEL_ID, ANNOUNCE_DISCORD_CHANNEL_ID);
    async function handleMessage(message) {
        if (message.data.activity_type === 'AVATAR_BOUGHT' || message.data.activity_type === 'AVATAR_GIFT_BOUGHT') {
            const name = message?.data?.data?.name || 'unknown';
            const count = message?.data?.data?.quantity || 1;

            if (bulkNotification[name] === undefined) {
                bulkNotification[name] = { count: 0, date: new Date() };
            }
            bulkNotification[name].count+=count;
            
            if(!skin_stats[name]){
                skin_stats[name] = 0;
            }
            skin_stats[name] += count;
            
            if (!skin_names.includes(name)) {
                skin_names.push(name);
                fs.writeFileSync('./skin_names.json', JSON.stringify(skin_names, null, 4));
                try {
                    const channel = client.channels.cache.get(ANNOUNCE_DISCORD_CHANNEL_ID);
                    if (channel) {
                        await channel.send(`Someone just bought a new skin: ${name}, check it out @everyone and make sure to gift one to Gasper.`);
                        console.log(`Someone just bought a new skin: ${name}`);
                    } else {
                        console.error(`Discord channel with ID ${ANNOUNCE_DISCORD_CHANNEL_ID} not found.`);
                    }
                } catch (error) {
                    console.error("Error sending Discord message:", error);
                }
            }

            processBulkNotification();
            fs.appendFileSync(`${FOLDER_PATH}SKINS-${message.data.created_at.substring(0, 10)}.log`, JSON.stringify(message) + '\r\n');
        }

    }

    centrifuge.subscribe('activity-feed', handleMessage);

    centrifuge.connect();
}

async function processBulkNotification() {
    if (isRunning) {
        return;
    }

    isRunning = true;

    for (let key in bulkNotification) {
        if (bulkNotification[key].date.getTime() < new Date().getTime() - 60 * 60 * 1000 || bulkNotification[key].count >= 100) {
            try {
                const channel = client.channels.cache.get(STATS_DISCORD_CHANNEL_ID);
                if (channel) {
                    await channel.send(`Update: ${key} was bought ${bulkNotification[key].count} times in the last ${(new Date().getTime() - bulkNotification[key].date.getTime())/60000} minutes totaling ${skin_stats[key]} sold`);
                } else {
                    console.error(`Discord channel with ID ${STATS_DISCORD_CHANNEL_ID} not found.`);
                }
            } catch (error) {
                console.error("Error sending Discord message:", error);
            }

            delete bulkNotification[key];
        }
    }

    isRunning = false;
}

client.on('ready', () => {
    start();
    setInterval(processBulkNotification, 60 * 1000);
});

