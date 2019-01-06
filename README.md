# djs-simplecmd
A simple command parser for discord.js  
This module has no dependencies as this library is based of discord.js.  
# Usage
To use this library, first create a `CommandParser` object (I recommend using one for each guild with the same commands for support for custom commands and custom prefix)  
Then, on your message event, call `CommandParser.parse` with the message like this:
```js
const Discord = require("discord.js")
const commandparse = require("djs-simplecmd")
const bot = new Discord.Client()
bot.on("ready", (message) => {
  console.log("Bot is ready!")
})
bot.on("message", (message) => {
  if (!message.guild.parser) {
    message.guild.parser = new commandparse.CommandParser({prefix: "!", commands: require("./commands.js")}) // We will get into how to create commands later
  }
  message.guild.parser.parse(message)
  // Insert additional code here
})
bot.login("[insert your token here]")
```
And you're set! Now, to create commands, you can add commands individually by using the `CommandParser.addCommand` method or by specifying the `commands` option in the object like the parser. In this case, we'll use a file called `commands.js` to specity the commands.  
Now, inside of commands.js, we have to define the commands. This is a Hello World example.
```js
const commands = [
  {
    "name": "test",
    "description": "Just a test command.",
    "defaultResponse": "Hello World"
  }
]
module.exports = commands
```
Put this inside commands.js in the same directory as the first script. (make sure you have discord.js and this lib installed)  
Run the code and type !help. It should reply with "Hello World"  

![Command Image](https://i.imgur.com/HDFJA3K.png "Command Image")  
