"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var cheerio_1 = require("cheerio");
console.log("test1");
// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://credBotCell:Travieso09465@cluster0.itmor.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const clientMongo = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// clientMongo.connect(err:any => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
// const tokenBot = process.env['BOTTOKEN'];
// const users: Object | any = {};
// //sum 2 
var precioDollar = 100;
function getPrecioDollar() {
    var lastPrecioDollar = precioDollar;
    // let channel: any =client.channels.fetch("933069296731574294");
    // let lastMessage:string  = channel.lastMessage.content;
    // let lastMessageSplitted:Array<string> = lastMessage.split(" ");
    // if(lastMessage.startsWith("!setdollar") && lastMessageSplitted.length == 2){
    //   let value:number = +lastMessageSplitted[1];
    //   if(value>0){
    //     lastPrecioDollar = value;
    //   }
    // }
    return lastPrecioDollar;
}
var fs = require('fs');
var _a = require('discord.js'), Client = _a.Client, Collection = _a.Collection, Intents = _a.Intents;
var client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
// const keepAlive = require("server");
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
            if (costoCajas.hasOwnProperty("" + msg.channel.name)) {
                var vals = msg.content.split(' ');
                if (vals.length > 1) {
                    var y = +(vals[1]);
                    var total = (Math.round(((costoCajas[msg.channel.name]) * lastPrecioDollar * y + 4) / 10)) * 10;
                    console.log(msg);
                    msg.channel.send("Son " + total + " CUP ");
                }
                else {
                    msg.channel.send("Creo que hay algo mal con ese comando");
                }
            }
            else {
                msg.channel.send("No tengo datos del servicio " + msg.channel.name);
            }
            // console.log(msg.channel.name);
        }
        else {
            if (msg.content.startsWith('!dollar')) {
                msg.channel.send("Original: " + precioDollar + " CUP\nActual: " + lastPrecioDollar + " CUP");
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
    return services.reduce(function (previusValue, currentValue) { return previusValue + "\n " + currentValue.name + " " + currentValue.time + " " + currentValue.val; }, "");
}
//keepAlive();
console.log("antes de");
// client.login(tokenBot);
client.login(process.env.DISCORD_TOKEN);
