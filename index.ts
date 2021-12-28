
const tokenBot = process.env['BOTTOKEN'];

const users:Object|any={};

let precioDollar:number=71;


const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


client.on('ready', () => {
  console.log("I'm running");
});

let costoCajas:Object|any={

    // "magma": 1.00,a
    "z3x": 1.145,
    "octoplus":0.115,
    "chimera": 0.122,
    "samkey-tm-spr":1.4,
    "samkey-code-reader":1.47,
    "t-unlock":0.42,
    "unlocktool":0,
    // "motokey":1.11,a
    // "laelo":0.07,a
    "simunlocker-pro": 1.24,
    "simunlocker-spr": 1.24,
    // "magict":1.1,a
    "samhub":1       

} 

client.on('message', (msg:any) => {
    if (msg.author.id != client.user.id) {
      console.log(msg.channel);
      if(msg.content.startsWith('!cred')){
        //  console.log(`Hola ${msg.channel.name}`);
        if(costoCajas.hasOwnProperty(`${msg.channel.name}`)){
            let vals: string[] = msg.content.split(' ');
            if(vals.length>1){
              var y: number = +(vals[1]);
              msg.channel.send(`Son ${(costoCajas[msg.channel.name])*precioDollar*y} CUP `);
            } 
            else{
              msg.channel.send(`Creo que hay algo mal con ese comando`);
            }
            
        }
        else{
          msg.channel.send(`No tengo datos del servicio ${msg.channel.name}`);
        }
        console.log(msg.channel.name);
      }     

    }
});

client.login(tokenBot);
