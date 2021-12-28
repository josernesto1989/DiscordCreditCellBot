"use strict";
const tokenBot = process.env['BOTTOKEN'];
const users = {};
let precioDollar = 71;
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.on('ready', () => {
    console.log("I'm running");
});
let costoCajas = {
    // "magma": 1.00,a
    "#z3x": 1.145,
    "#octoplus": 0.115,
    "#chimera": 0.122,
    "#samkey-tm-spr": 1.4,
    "#samkey-code-reader": 1.47,
    "#t-unlock": 0.42,
    "#unlocktool": 0,
    // "motokey":1.11,a
    // "laelo":0.07,a
    "#simunlocker-pro": 1.24,
    "#simunlocker-spr": 1.24,
    // "magict":1.1,a
    "#samhub": 1
};
client.on('message', (msg) => {
    if (msg.author.id != client.user.id) {
        console.log(msg.channel);
        if (msg.content.startsWith('!cred')) {
            if (costoCajas.hasOwnProperty(`${msg.channel}`)) {
                msg.channel.send(`Hola ${(costoCajas[msg.channel]) * precioDollar}`);
            }
            console.log(msg.channel);
            msg.channel.send(`Hola ${msg.channel}`);
        }
    }
});
client.login(tokenBot);
//# sourceMappingURL=index.js.map