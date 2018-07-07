//const {prefix,token,defaultTextChannels,defaultVoiceChannels,defaultRoles} = require('./config.json');
const config = require('./config.json');
const token = require('./token.json')
const Discord = require('discord.js');
const client = new Discord.Client();
const byzSmackNum = 4;
function contains(target, set){
    var output = false;
    set.forEach(item=>{
        if(item === target){
            output = true;
        }
    });
    return output;
}
client.on('ready', () => {
    
    console.log("Ready!");
     
});
client.on('message', message =>{
    //defines standard roles
    let allies = message.guild.roles.find("name", "Allies");
    let axis = message.guild.roles.find("name", "Axis");
    let comintern = message.guild.roles.find("name", "Comintern");
    let everyone = message.guild.roles.find("name", "@everyone");
    //Special case - no prefix required for mehmet delivering cold hard truth.
    if(message.content.toLowerCase() === "byzantium is good"){
        rand = Math.floor(Math.random() * byzSmackNum);
        if(rand == 0)
            message.channel.send("I hear " + message.author.username + " is a filthy Grecophile.");
        if(rand == 1)
            message.channel.send("no");
        if(rand == 2)
            message.channel.send("1453 best year of my life");
        if(rand == 3)
            message.channel.send("I conquered Constantinople at 21. What have you done with your life, " + message.author.username + "?");
    }
    //filter out the weak.
    if(!message.content.startsWith(config.prefix) || message.author.bot)
        return;

    const args = message.content.slice(config.prefix.length).split(' ');//Turns the textline into an array of args.
    const command = args.shift().toLowerCase();//returns the first argument (the command) and then removes it from the array.
    //prints the message to the console.
    console.log(message.author.username + " said: " + message.content);
    console.log("command: " + command);
    console.log("args: " + args); 
    //faction joining
    if(command === "join"){
        //invalid command
        if(args[0] == null){
            message.channel.send('To join a faction, write "join [your faction here]".');
        }
        //valid command
        else{
            var roleName = "";
            //connects all the arguments into one string
            args.forEach(item => {
                if(roleName === ""){//first arg
                    roleName = item;
                }
                else{
                    roleName += " " + item;//subsequent args
                }
            })
            //will return null if the role does not currently exist
            var role = message.guild.roles.find("name", roleName.toLowerCase());
            if(role != null){//Join pre-existing role
                message.member.setRoles([role]);
                message.channel.send(message.author.username + " joined " + role.name);
            }
            else{
                message.guild.createRole({//Create new role
                    name: roleName.toLowerCase(),
                    hoist: true,
                    mentionable: true,
                    color: "RANDOM"
                }).then(//runs after CreateRole resolves the promise, and we create role as a local variable
                    role =>{
                        message.channel.send("the " + role.name + " faction was created by " + message.author.username);
                        console.log(role.name + " role was created.");
                        message.member.setRoles([role]);
                        //createChannel(name, type, array of PermissionOverwrites or ChannelCreationOverwrites)
                        message.guild.createChannel(role.name, "voice",[
                            {
                                id: everyone,
                                deny:["CONNECT"]
                            },{
                                id: role,
                                allow:["CONNECT"]
                            }
                        ]).then(
                            console.log(role.name + " voice channel created.")
                        ).catch(console.error)//voice createChannel error handler
                        message.guild.createChannel(role.name + "-chat", "text",[
                            {
                                id: everyone,
                                deny:["VIEW_CHANNEL"]
                            },{
                                id: role,
                                allow:["VIEW_CHANNEL"]
                            }
                        ]).then(
                            channel =>{
                                console.log(role.name + " text channel created.");
                                channel.send("Welcome to the " + role.name + " text channel.");
                                channel.setTopic(role.name + " text channel").then().catch(console.error);
                            }                           
                        ).catch(console.error)//text createChannel error handler
                    }
                ).catch(console.error)//createRole error handler
            }


        }
        
    }
    //Bossman commands
    else if(message.channel.permissionsFor(message.member).has("ADMINISTRATOR")){
        if(command === 'reset'){
            console.log("initiating reset process");
            message.guild.roles.forEach(role=>{//delete extraneous roles
                //if(!(role.name === "allies" || role.name === "axis" || role.name === "comintern" || role.name === "Turk" || role.name === "@everyone" || !role.editable)){//default roles
                if(contains(role.name, config.defaultRoles) && role.editable){//TODO: figure out configs
                    console.log("deleting " + role.name + " role");
                    role.delete();
                }
            })
            message.guild.channels.forEach(channel=>{//delete extraneous channels
                if(!(channel.name === "Allies" || channel.name === "Axis" || channel.name === "Comintern" || channel.name === "League of Nations" ||//default voice channels
                     channel.name === "allies-chat" || channel.name === "axis-chat" || channel.name === "comintern-chat" || channel.name === "main" )){//default text channels
                    console.log("deleting " + channel.name + " channel");
                    channel.delete();
                }
                else if(channel.type === "text" && !(channel.name === "main")){
                    channel.bulkDelete(99,true);
                    channel.send("Welcome to the " + channel.name.substr(0,channel.name.indexOf("-")) + " text channel.");
                }
            })
            message.guild.members.forEach(member=>{//reset roles
                if(!(member.hasPermission("ADMINISTRATOR"))){
                    member.setRoles([]);
                }
            })
        }
        if(command === 'prune'){
            if(args.size != 0){
                message.channel.bulkDelete(args[0],true);
            }
        }
    }
})
client.login(token.token);