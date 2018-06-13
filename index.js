const {prefix,token} = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const byzSmackNum = 3;
var roleList;
client.on('ready', () => {
    
    console.log('Ready!');
     
});
client.on('message', message =>{
    //defines roles
    let allies = message.guild.roles.find("name", "Allies");
    let axis = message.guild.roles.find("name", "Axis");
    let comintern = message.guild.roles.find("name", "Comintern");
    var roleList = [allies,axis,comintern];
    //Special case - no prefix required for mehmet delivering cold hard truth.
    if(message.content.toLowerCase() === 'byzantium is good'){
        rand = Math.floor(Math.random() * byzSmackNum);
        if(rand == 0)
            message.channel.send('I hear ' + message.author.username + ' is a filthy Grecophile.');
        if(rand == 1)
            message.channel.send('no');
        if(rand == 2)
            message.channel.send('1453 best year of my life');
    }
    //filter out the weak.
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(' ');//Turns the textline into an array of args.
    const command = args.shift().toLowerCase();//returns the first argument (the command) and then removes it from the array.
    //prints the message to the console.
    console.log(message.author.username + ' said: ' + message.content);
    console.log("command: " + command);
    console.log("args: " + args); 
    //faction joining
    if(command === 'join'){
        //invalid command
        if(args[0] == null){
            message.channel.send("To join a faction, write \"join [your faction here]\".")
        }
        //valid command
        else{
            //will return null if the role does not currently exist
            var role = message.guild.roles.find("name", args[0].toLowerCase());
            if(role != null){
                message.member.setRoles([role])
                message.channel.send(message.author.username + " joined " + role.name);
            }
            else
            {
                message.channel.send("That faction doesn't exist!");
                
            }


        }
        
    }
    //Bossman commands
    else if(message.channel.permissionsFor(message.member).has("ADMINISTRATOR")){
        if(command === 'prune'){
            if(args.size != 0){
                message.channel.bulkDelete(args[0],true);
            }
        }
    }
})
client.login(token);