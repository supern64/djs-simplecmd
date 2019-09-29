function pad(pad, str, padLeft) {
  if (typeof str === 'undefined')
    return pad;
  if (padLeft) {
    return (pad + str).slice(-pad.length);
  } else {
    return (str + pad).substring(0, pad.length);
  }
}

class CommandParser {
  constructor(options) {
    this.options = options
    if (!options.prefix || options.prefix === "" || typeof options.prefix !== "string") {
      throw new Error("Prefix must be defined and must be a string and cannot be an empty string.")
    }
    this.commands = options.commands || []
    this.customData = options.customData || {}
    this.prefix = options.prefix
    this.talkedRecently = new Set();
    if (this.options.makeHelpCommand === true || this.options.makeHelpCommand == undefined) {
      var helpArray = []
      var helpString = ""
      helpString += pad(Array(this.commands.map(r=> r.name).reduce(function (a, b) { return a.length > b.length ? a : b; }).length + 2).join(" "), "Name") + "Description\n"
      for (var i of this.commands) {
        var paddedName = pad(Array(this.commands.map(r=> r.name).reduce(function (a, b) { return a.length > b.length ? a : b; }).length + 2).join(" "), i.name)
        helpString += paddedName + i.description + "\n"
        if (this.commmands.indexOf(i) % 30 === 0) {
          helpArray.push(helpString)
          helpString = ""
        }
      }
      this.addCommand({
        name: "help",
        description: "Displays the help message.",
        noArgumentRule: true,
        noReturn: true,
        // arguments: ['command'] TODO
        function: (message, args) => {
          if (args.command) {
            // TODO
          } else {
            message.author.reply("the help message has been sent by DMs!")
            for (var i of helpArray) {
              message.author.send(i)
            }
          }
        }
      })
    }
  }
  parse(message) {
    var messageArray = message.content.match(/(?:[^\s"]+|"[^"]*")+/g)
    var messageArray = messageArray.map(r=> r.replace('"', "'"))
    var args = messageArray.slice(1)
    var command = messageArray[0]
    if (this.commands.map(r=> this.prefix + r.name).includes(command)) {
      var commandObject = this.commands.filter(r=> r.name == command.split('').slice(this.prefix.length).join(''))[0]
      if (commandObject.cooldown) {
        if (this.talkedRecently.has(message.author.id)) {
          message.reply("Please wait "  + (commandObject.cooldown / 1000) + " seconds before using this command again.")
          return
        } else {}
      }
      if (!commandObject.arguments) commandObject.arguments = []
      if (args.length === 0 && commandObject.arguments.length !== 0 && !commandObject.noArgumentRule) {
        message.channel.send("Correct Usage: " + this.prefix + commandObject.name + " " + commandObject.arguments.map(r=> "[" + r + "]").join(' ') + "\nDescription: " + commandObject.description || "None")
        return
      }
      if (args.length !== commandObject.arguments.length && !commandObject.noStrictArgumentRule && !commandObject.noArgumentRule) {
        message.channel.send("Correct Usage: " + this.prefix + commandObject.name + " " + commandObject.arguments.map(r=> "[" + r + "]").join(' ') + "\nDescription: " + commandObject.description || "None")
        return
      } else {
        if (!commandObject.arrayArgs) {
          var arrayArgs = args
          args = {}
          var commandArgs = commandObject.arguments
          for (var i of arrayArgs) {
            args[commandArgs[arrayArgs.indexOf(i)]] = i
          }
        }
        var returns = commandObject.function ? commandObject.function(message, args, this.customData) : undefined
        if (!returns) {
          if (commandObject.noReturn) {
            if (commandObject.cooldown) {
              this.talkedRecently.add(message.author.id)
              setTimeout(() => {
                this.talkedRecently.delete(message.author.id);
              }, commandObject.cooldown);
            }
            return
          }
          if (!commandObject.defaultResponse) {
            throw new Error("No default response specified|is null and function returned undefined|null.")
          } else {
            message.channel.send(commandObject.defaultResponse)
            return
          }
        } else {
          if (commandObject.cooldown) {
            this.talkedRecently.add(message.author.id)
            setTimeout(() => {
                this.talkedRecently.delete(message.author.id);
            }, commandObject.cooldown);
          }
          if (returns.embed && returns.text) {
            message.channel.send(returns.text, {embed: returns.embed})
            return
          } else if (returns.embed) {
            var embed = returns.embed
            message.channel.send({embed})
            return
          } else {
            message.channel.send(returns.text)
          }
        }
      }
    }
  }
  addCommand(command) {
    if (command.name && (command.function || command.defaultResponse)) {
      this.commands.push(command)
    } else {
      throw new Error("Command must have a name and either a function or a default response.")
    }
  }
  setPrefix(prefix) {
    if (!prefix || prefix === "" || typeof prefix !== "string") {
      throw new Error("Prefix must be defined and must be a string and cannot be an empty string.")
    }
    this.prefix = prefix
    this.options.prefix = prefix
  }
}
function attach(bot, options) {
  bot.on("message", (message) => {
    if (!message.guild.parser) {
      message.guild.parser = new CommandParser(options)
    }
    message.guild.parser.parse(message)
  })
}
module.exports.CommandParser = CommandParser
module.exports.attach = attach
