var DiscordClient = require('discord.io');

var Utils = require('./Utils.js');
var Exercice = require('./Exercice.js');

var CONFIG = require('./config.json');
var CREDENTIALS = require('./credentials.json');

var bot = new DiscordClient({
  autorun: true,
  email: CREDENTIALS.EMAIL,
  password: CREDENTIALS.PASSWORD
});

bot.on('ready', function() {
  console.log(bot.username + ' - (' + bot.id + ')');

  Object.keys(bot.servers).map(function( serverID, index ) {
    server = bot.servers[serverID];

    var userList = [];
    var topChannelID;

    console.log('server: ' + server.name + '(' + server.id + ')');

    // List users
    for (var userID in server.members) {
      var member = server.members[userID];

      userList.push({
        ID: userID,
        username: member.username
      });
    }

    // List Channel
    for (var channelID in server.channels) {
      var channel = server.channels[channelID];
      if (channel.type !== 'text') continue;

      console.log('channel: ' + channel.name + '(' + channelID + ')');

      if (channel.position === 0) topChannelID = channelID;
    }

    // If no top channel, exit
    if (!topChannelID) return;

    // Warn everyone about pushups
    bot.sendMessage({
      to: topChannelID,
      message: 'ARE YOU READY TO DO SOME PUSHUPS?'
    });

    setInterval(function() {
      var user = Utils.RandomInArray(userList);

      var exercice = new Exercice({
        userID: user.ID
      });

      bot.sendMessage({
        to: topChannelID,
        message: exercice.getMessage(),
        typing: true
      });

      bot.setPresence({
        game: 'Doing ' + exercice._name + ' with ' + user.username
      });

    }, CONFIG.EXERCISES.DELAY);
  });

});

bot.on('message', function( user, userID, channelID, message, rawEvent ) {
  if (message === '!score') {

  }
});

