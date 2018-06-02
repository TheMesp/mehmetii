const {prefix,token} = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const byzSmackNum = 3;

client.on('ready', () => {
    console.log('Ready!');
});
client.on('message', message =>{
    //filter out the weak.
    if((!message.content.startsWith(prefix)&&!message.content === 'Byzantium is good') || message.author.bot) return;
    const args = message.content.slice(prefix.length).split('/ +/');//Turns the textline into an array of args.
    const command = args.shift().toLowerCase();//returns the first argument (the command) and then removes it from the array.

    //defines "admin" as the role that can access advanced bot commands.
    let admin = message.guild.roles.find("name", "Game Coordinator");

    //prints the message to the console.
    console.log(message.author.username + ' said: ' + message.content);
    //Special case - no prefix required for mehmet delivering cold hard truth.
    if(message.content === 'Byzantium is good'){
        rand = Math.floor(Math.random() * byzSmackNum);
        if(rand == 0)
            message.channel.send('I hear ' + message.author.username + ' is a filthy Grecophile.');
        if(rand == 1)
            message.channel.send('no');
        if(rand == 2)
            message.channel.send('1453 best year of my life');
    }
    //prefixed commands
    else if(command === 'join'){
        
    }
    //Bossman commands
    else if(message.member.roles.has(admin.id)){
        console.log("bossman said something");
        if(command === 'prune'){
            if(args.size != 0){
                message.channel.bulkDelete(args[0],true);
            }
        }
    }
})
client.login(token);