# djs-simplecmd
A simple command parser for discord.js  
This module has no dependencies as this library is based off of discord.js.  

[![NPM](https://nodei.co/npm/djs-simplecmd.png)](https://npmjs.com/package/djs-simplecmd)
# Usage
First, install the library in the project you want to use this with using:
```bash
npm install djs-simplecmd
```
Then, to use this library, first create a `CommandParser` object (I recommend using one for each guild with the same commands for support for custom commands and custom prefix)  
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
    message.guild.parser = new commandparse.CommandParser({prefix: "&", commands: require("./commands.js")}) // We will get into how to create commands later
  }
  message.guild.parser.parse(message)
  // Insert additional code here
})
bot.login("[insert your token here]")
```
And you're set! Now, to create commands, you can add commands individually by using the `CommandParser.addCommand` method or by specifying the `commands` option in the object like this example. In this case, we'll use a file called `commands.js` to specity the commands.  
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
Run the code and type &test. It should reply with "Hello World"  

![Command Image](https://i.imgur.com/HDFJA3K.png "Command Image")  

Voila! You just made a simple bot! There's more to it, of course!

# Documentation
`CommandParser` class:

Options:
- **prefix**: (String) The prefix to use for the parser (required) 
- **commands**: (Array) An array of commands to use

Methods:
- **parse(message)**: Parses a message for commands  
  Arguments:
  - **message**: (Message) The discord.js `Message` object to parse for commands
- **addCommand(command)**: Adds a command to the command list  
  Arguments:
  - **command**: (Object) The `Command` object to add as a command
- **setPrefix(prefix)**: Sets the prefix  
  Arguments:
  - **prefix**: (String) The prefix to change to
  
`Command` object:

A command object is a regular object.  
Properties:
- **name**: (String) The name of the command to use (required)
- **description**: (String) The description of the command 
- **defaultResponse**: (String) The default response to use if there is no function (required if function is not present)
- **function** (Function) The function to invoke when executing the command (required if defaultResponse is not present)
  This function will be passed 2 arguments which is message and args.
  - **message**: (Message) The discord.js message object that was passed.
  - **args**: (Array) An array of arguments passed.  

  The function must return an object with either one or both of these properties if noReturn is false:
  - **text**: (String) The text to send.
  - **embed**: (RichEmbed) The discord.js RichEmbed object to send.
- **noStrictArgumentRule**: (Boolean) True if the command can accept a undefined number of arguments but 0.
- **noArgumentRule**: (Boolean) True if the command can accept any amount of arguments including 0.
- **noReturn**: (Boolean) True if the command won't return anything and will send the response itself. Useful if you use any function that is promise-based.
- **cooldown**: (Number) The amount of milliseconds the user has to wait before invoking a command again.

If you have any issues regarding the library, you can file an issue report!
