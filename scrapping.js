"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const cheerio_1 = require("cheerio");
;
const AxiosInstance = axios_1.default.create(); // Create a new Axios Instance
let resp = "";
function getPriceRay(filterText, msg) {
    const urlList = ['https://rayunlocker.com/index.php/resellerpricing/imei',
        'https://rayunlocker.com/index.php/resellerpricing/server',
        'https://rayunlocker.com/index.php/resellerpricing/remote',
        'https://rayunlocker.com/index.php/resellerpricing/file'
    ];
    urlList.forEach(function (url) {
        // Send an async HTTP Get request to the url
        AxiosInstance.get(url)
            .then(// Once we have data returned ...
        // Once we have data returned ...
        response => {
            let services = [];
            resp = "";
            const html = response.data; // Get the HTML from the HTTP request
            // console.log(html);
            const $ = cheerio_1.default.load(html); // Load the HTML string into cheerio
            const row = $('tr.service'); // Parse the HTML and extract just whatever code contains .statsTableContainer and has tr inside
            row.each((i, elem) => {
                let serv = { name: "", val: 0, type: "ray", time: "" };
                serv.name = $(elem).find('td>a').text();
                serv.time = $(elem).find('td.text-center>span').text().trim(); // 
                serv.val = +$(elem).find('td.text-right>span.nowrap').text().replace("USD", "").trim();
                if (serv.name.toLowerCase().includes(filterText.toLowerCase())) {
                    services.push(serv);
                }
            });
            if (services.length > 0) {
                msg.channel.send(servicePriceListToString(services));
            }
            else {
                msg.channel.send(`No se encontraron servicios con ese nombre :(`);
            }
        });
    });
}
function servicePriceListToString(services) {
    return services.reduce((previusValue, currentValue) => `${previusValue}\n ${currentValue.name} ${currentValue.time} ${currentValue.val}`, "");
}
// getPriceRay('device');
//   .catch(console.error); // Error handling
//# sourceMappingURL=scrapping.js.map