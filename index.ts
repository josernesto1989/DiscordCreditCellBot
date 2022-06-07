require('dotenv').config();
import axios from 'axios';
import cheerio from 'cheerio';

let precioDollar: number = 100;
let divisasList: {[key: string]: number}={
'precioDollarRay':115,
'precioMlc':110,
'precioEuro':112
}

function getPrecioDollar():number{
  let lastPrecioDollar: number =  precioDollar;
  return lastPrecioDollar;
}


const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const keepAlive = require("server");

client.on('ready', () => {
  console.log("I'm running");
});

// client.on('message', (msg: any) => {
//   console.log("msg");
//   if (msg.author.id != client.user.id) {

//     msg.channel.send(`Estoy a prueba, ignorame`);
//   }

// }
// );
let costoCajas: Object | any = {

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
  "mtk-gogogo": 1.05,
  // "magict":1.1,a
  "samhub": 1

}

client.on('message', (msg: any) => {
  console.log("msg");
  let lastPrecioDollar = getPrecioDollar();
  if (msg.author.id != client.user.id) {
    if (msg.content.startsWith('!cred')) {
      //  console.log(`Hola ${msg.channel.name}`);
      if (costoCajas.hasOwnProperty(`${msg.channel.name}`)) {
        let vals: string[] = msg.content.split(' ');
        if (vals.length > 1) {
          var y: number = +(vals[1]);

          var total: number = (Math.round(((costoCajas[msg.channel.name]) * lastPrecioDollar * y + 4) / 10)) * 10;
          console.log(msg);
          msg.channel.send(`Son ${total} CUP `);
        }
        else {
          msg.channel.send(`Creo que hay algo mal con ese comando`);
        }

      }
      else {
        msg.channel.send(`No tengo datos del servicio ${msg.channel.name}`);
      }
      // console.log(msg.channel.name);
    }
    else {
      if (msg.content.startsWith('!dollar')) {
        msg.channel.send(`Original: ${precioDollar} CUP\nActual: ${lastPrecioDollar} CUP`);
      }
      else {
        if (msg.content.startsWith('!remoto')) {
          let splittedMsg: Array<string> = msg.content.split(" ");
          let filterWords:string = "";
          if(splittedMsg.length>1){
            splittedMsg.shift();
            filterWords = splittedMsg.join(' ');
          }
          getPriceRay(filterWords,msg);
          
        }
	else{
	      if (msg.content.startsWith('!divisas')) {
				
			let answ:string = "";
			for (let key in divisasList) {
			  answ = answ +`\n${key}: ${divisasList[key]}`;
			}
			msg.channel.send(answ);
		}	
	}
      }

    }

  }
});

interface ServicePrice {
    val: number; 
    name: string;
    type: string;
    time:string;
  }



// ; 
const AxiosInstance = axios.create(); // Create a new Axios Instance


function getPriceRay(filterText:string, msg:any){
  const urlList: Array<string> = 
  ['https://rayunlocker.com/index.php/resellerpricing/imei',
  'https://rayunlocker.com/index.php/resellerpricing/server',
  'https://rayunlocker.com/index.php/resellerpricing/remote',
  'https://rayunlocker.com/index.php/resellerpricing/file'
  ];
  urlList.forEach(function(url){
    let lastPrecioDollar:number = getPrecioDollar();
    // Send an async HTTP Get request to the url
    AxiosInstance.get(url)
      .then( // Once we have data returned ...
        response => {
            let services: Array<ServicePrice> = [];
         
            const html = response.data; // Get the HTML from the HTTP request
            const $ = cheerio.load(html); // Load the HTML string into cheerio
            const row: any = $('tr.service'); // Parse the HTML and extract just whatever code contains .statsTableContainer and has tr inside
              
              
            row.each((i:number, elem:any) => {
              let serv: ServicePrice ={name:"",val:0,type:"ray",time:""};
              serv.name = $(elem).find('td>a').text()
              serv.time= $(elem).find('td.text-center>span').text().trim(); // 
              serv.val =  (+$(elem).find('td.text-right>span.nowrap').text().replace("USD","").trim())* divisasList['precioDollarRay'];
              if(filterText!="" && serv.name.toLowerCase().includes(filterText.toLowerCase())){
                  services.push(serv);
              }
              else{
                if(filterText==""){
                    services.push(serv);
                }
              }
              
        }
        
      )//930888553972514826
      if(services.length>0){
        let mensaje:string =servicePriceListToString(services);
        if(mensaje.length<1500){
          msg.channel.send(mensaje);
          }
          else{
            msg.channel.send("Son muchos los resultados.........");
          }
      }
      else{
        msg.channel.send(`No se encontraron servicios con ese nombre :(`)
      }
      
        });
    }
  );
}

function servicePriceListToString(services: Array<ServicePrice>): string{
  return services.reduce((previusValue:string,currentValue: ServicePrice)=>`${previusValue}\n ${currentValue.name} ${currentValue.time} ${currentValue.val}`,"");
}


keepAlive();
console.log("antes de");
console.log('token',process.env.DISCORD_TOKEN);
client.login(process.env.DISCORD_TOKEN);

