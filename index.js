"use strict";
exports.__esModule = true;
require('dotenv').config();
var axios_1 = require("axios");
var cheerio_1 = require("cheerio");
var precioDollar = 100;
function getPrecioDollar() {
    var lastPrecioDollar = precioDollar;
    return lastPrecioDollar;
}
var fs = require('fs');
var _a = require('discord.js'), Client = _a.Client, Collection = _a.Collection, Intents = _a.Intents;
var client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
var keepAlive = require("server");
client.on('ready', function () {
    console.log("I'm running");
});
// client.on('message', (msg: any) => {
//   console.log("msg");
//   if (msg.author.id != client.user.id) {
//     msg.channel.send(`Estoy a prueba, ignorame`);
//   }
// }
// );
var costoCajas = {
    // "magma": 1.00,a
    "z3x": 1.145,
    "octoplus": 0.115,
    "chimera": 0.122,
    "samkey-tm-spr": 1.4,
    "samkey-code-reader": 1.47,
    "t-unlock": 0.42,
    "unlocktool": 0,
    // "motokey":1.11,a
    // "laelo":0.07,a
    "simunlocker-pro": 1.24,
    "simunlocker-spr": 1.24,
    // "magict":1.1,a
    "samhub": 1
};
client.on('message', function (msg) {
    console.log("msg");
    var lastPrecioDollar = getPrecioDollar();
    if (msg.author.id != client.user.id) {
        if (msg.content.startsWith('!cred')) {
            //  console.log(`Hola ${msg.channel.name}`);
            if (costoCajas.hasOwnProperty("".concat(msg.channel.name))) {
                var vals = msg.content.split(' ');
                if (vals.length > 1) {
                    var y = +(vals[1]);
                    var total = (Math.round(((costoCajas[msg.channel.name]) * lastPrecioDollar * y + 4) / 10)) * 10;
                    console.log(msg);
                    msg.channel.send("Son ".concat(total, " CUP "));
                }
                else {
                    msg.channel.send("Creo que hay algo mal con ese comando");
                }
            }
            else {
                msg.channel.send("No tengo datos del servicio ".concat(msg.channel.name));
            }
            // console.log(msg.channel.name);
        }
        else {
            if (msg.content.startsWith('!dollar')) {
                msg.channel.send("Original: ".concat(precioDollar, " CUP\nActual: ").concat(lastPrecioDollar, " CUP"));
            }
            else {
                if (msg.content.startsWith('!remoto')) {
                    var splittedMsg = msg.content.split(" ");
                    var filterWords = "";
                    if (splittedMsg.length > 1) {
                        splittedMsg.shift();
                        filterWords = splittedMsg.join(' ');
                    }
                    getPriceRay(filterWords, msg);
                }
            }
        }
    }
});
// ; 
var AxiosInstance = axios_1["default"].create(); // Create a new Axios Instance
function getPriceRay(filterText, msg) {
    var urlList = ['https://rayunlocker.com/index.php/resellerpricing/imei',
        'https://rayunlocker.com/index.php/resellerpricing/server',
        'https://rayunlocker.com/index.php/resellerpricing/remote',
        'https://rayunlocker.com/index.php/resellerpricing/file'
    ];
    urlList.forEach(function (url) {
        var lastPrecioDollar = getPrecioDollar();
        // Send an async HTTP Get request to the url
        AxiosInstance.get(url)
            .then(// Once we have data returned ...
        function (// Once we have data returned ...
        response) {
            var services = [];
            var html = response.data; // Get the HTML from the HTTP request
            var $ = cheerio_1["default"].load(html); // Load the HTML string into cheerio
            var row = $('tr.service'); // Parse the HTML and extract just whatever code contains .statsTableContainer and has tr inside
            row.each(function (i, elem) {
                var serv = { name: "", val: 0, type: "ray", time: "" };
                serv.name = $(elem).find('td>a').text();
                serv.time = $(elem).find('td.text-center>span').text().trim(); // 
                serv.val = (+$(elem).find('td.text-right>span.nowrap').text().replace("USD", "").trim()) * lastPrecioDollar;
                if (filterText != "" && serv.name.toLowerCase().includes(filterText.toLowerCase())) {
                    services.push(serv);
                }
                else {
                    if (filterText == "") {
                        services.push(serv);
                    }
                }
            }); //930888553972514826
            if (services.length > 0) {
                var mensaje = servicePriceListToString(services);
                if (mensaje.length < 1500) {
                    msg.channel.send(mensaje);
                }
                else {
                    msg.channel.send("Son muchos los resultados.........");
                }
            }
            else {
                msg.channel.send("No se encontraron servicios con ese nombre :(");
            }
        });
    });
}
function servicePriceListToString(services) {
    return services.reduce(function (previusValue, currentValue) { return "".concat(previusValue, "\n ").concat(currentValue.name, " ").concat(currentValue.time, " ").concat(currentValue.val); }, "");
}
keepAlive();
console.log("antes de");
console.log('token', process.env.DISCORD_TOKEN);
client.login(process.env.DISCORD_TOKEN);
