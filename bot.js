//Dependancies
require("dotenv").config();
const TMI = require("tmi.js");
const googleIt = require("google-it");

// Bot Name and Password
const BOT_NAME = "sentinal_bot";
// LINE OF CODE NOT NEEDED, LEFT FOR REFERENCE
// const TMI_OAUTH = "<tmi oauth token here>";
const TMI_OPTIONS = {
  identity: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
  channels: [process.env.CHANNELS],
};

// Connect bot to channels and get client instance
const client = new TMI.client(TMI_OPTIONS);
client.on("connecting", onConnectingHandler);
client.on("connected", onConnectedHandler);
client.on("disconnect", onDisconnectHandler);
client.on("raided", onRaidHandler);
client.on("subscription", onSubHandler);
client.on("timeout", onTimeOutHandler);
client.on("message", onMessageHandler);

client.connect();

// Called every time the bot attempts to connect to Twitch chat
function onConnectingHandler(addr, port) {
  console.log(`* Connecting to ${addr}:${port}`);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

// Called if bot disconnects suddenly
function onDisconnectHandler(reason) {
  console.log(`* Bot disconnected from chat. REASON: ${reason}`);
}

// Called if channel the bot resides in is raided
function onRaidHandler(target, username, viewers) {
  client.say(
    target,
    `Whoa! @${username} is raiding with ${viewers} viewers! What's up guys?!`
  );
}

// Called if channel the bot resides in receives a sub
function onSubHandler(target, username, method, message, userstate) {
  client.say(
    target,
    `Buckle up butter cup! @${username}, you're in for a wild ride! Seriously though, thank you for the support! I love you <3`
  );
}

// Called if a user in the channel the bot resides is timed out
function onTimeOutHandler(target, username, reason, duration, userState) {
  client.say(target, `Oops! @${username} Is in horny jail for ${duration}`);
}

//Keeps track of who has been in the chat
//Can be configured to attach to a .txt file for logging purposes
let userPool = [
  {
    username: "token_viper",
    subscriber: true,
  },
];

//Interval Messaging
//=============================================================================================================================================
// These can be changed to suit your needs, can contain more variety
let setIntervalMessage = [
  "/me changes the color of bot text",
  "/me If you like what you see, don't wait to hit that follow button! You'll get my content for absolutely free :).",
  "/me For the lurkers: I love all of you and if you come back, I'll give you a free mustache ride! <3",
  "/me Keep up with me and the stream on the Token_Viper Discord: https://discord.gg/UPqcNYu3gt",
  ];

// // Delays first message to give time for the bot to connect to IRC server
// setTimeout(function () {
//   // Throws message to chat on an interval

//   setInterval(
//     function () {
//       let intervalRandom = Math.floor(
//         Math.random() * setIntervalMessage.length
//       );
//       let date = new Date();
//       let hours = date.getHours();
//       let mins = date.getMinutes();
//       let time = `${hours}:${mins}`;
//       console.log(`message sent @ ${time}`);
//       client.say(process.env.CHANNELS, setIntervalMessage[intervalRandom]);
//     },
//     // interval between messages measured in ms.
//     //1000 ms/sec
//     //3600000 ms/hr
//     300000
//   );
//   //Delay to allow bot to connect to IRC server
// }, 1000);

//=============================================================================================================================================

// Called every time a message is typed in a chat that the bot is connected to
function onMessageHandler(target, context, message, self) {
  // Just leave this function if the message is from self
  if (self) {
    return;
  }

  // These can be changed to suit your needs, can contain more variety
  // context.username is a pointer to the message's sender replying to them.
  let greetingMessage = [
    `Hey there @${context.username}! Super excited you are here today! Tell the class how you're doin'`,
    `What's up @${context.username}? Glad you're joining us! How are ya?`,
    `Howdy @${context.username}?! Thanks for joining, Hope you're doing well!`,
    `ATTENTION: @${context.username} has entered the area!`,
  ];

  // Sets up object pre push to userPool
  //=============================================================================================================================================
  user = { username: context.username, subscriber: context.subscriber };
  //=============================================================================================================================================

  // Username is pulled from message. Message is then trimmed and sliced for future use.
  let trimmedMessage = message.trim();
  let splitMessage = trimmedMessage.split(" ");
  let targetUser = user.username;
  if (splitMessage.length > 1) {
    targetUser = splitMessage[1];
  }

  // Matches a hard coded String to match against bot messages to auto delete
  //=============================================================================================================================================
  let autoDeleteBotMessage =
    "Wanna become famous? Buy followers and viewers on https://clck.ru/UH8eF";
  let autoDeleteSplitMessage = autoDeleteBotMessage.split(" ");
  let matchCounter = 0;

  if (
    //if first 2 words of message match, continue
    splitMessage[0].toLowerCase() === autoDeleteSplitMessage[0].toLowerCase() &&
    splitMessage[1].toLowerCase() === autoDeleteSplitMessage[1].toLowerCase()
  ) {
    for (let a = 0; a < 9; a++) {
      if (
        splitMessage[a].toLowerCase() ===
        autoDeleteSplitMessage[a].toLowerCase()
      ) {
        matchCounter++;
      }
    }
    if (matchCounter > 2) {
      client
        .deletemessage(process.env.CHANNELS, context.id)
        .then((data) => {
          console.log(
            `Message from ${context.username} deleted on Channel ${TMI_OPTIONS.channels[0]}\n` +
              `REASON: Bot message deleted.`
          );
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    }
  }
  //=============================================================================================================================================

  // Greet a user chatting for the first time on the stream
  //=============================================================================================================================================
  let findUser = user.username;
  let match = false;
  for (let i = 0; i < userPool.length; i++) {
    if (findUser === userPool[i].username) {
      match = true;
    }
  }

  if (match === false) {
    // client.say(
    //   target,
    //   greetingMessage[Math.floor(greetingMessage.length * Math.random())]
    // );
    console.log(`Greeting message sent to @${findUser}, userPool updated.`);
    userPool.push(user);
    console.log(userPool);
  }
  // else {
  //   console.log(findUser + " found.");
  // }
  //=============================================================================================================================================

  // Commands
  //=============================================================================================================================================
  // new commands can be made here

  // Broadcaster/Moderator commands
  //=============================================================================================
  //let url="https://www.google.com/search?q=";
  if (
    (splitMessage[0].startsWith("!") === true &&
      context.username === "Token_Viper") ||
    (context.username === "s0n_h3li0s" &&
      splitMessage[0].startsWith("!") === true)
  ) {
    let command = splitMessage[0];
    switch (command) {
      case "!clear":
        onClearCommand();
        break;
      case "!so":
        let shoutOutTarget = splitMessage[1];
        onShoutOutCommand(target, shoutOutTarget);
        break;
      case "!gts":
        googleIt({ query: splitMessage.slice(1).join(" "), limit: 1 })
          .then((results) => {
            let snippet = limit(results[0].snippet, 75);
            client.say(target, "First result on google:");
            client.say(target, results[0].title + " Link: " + results[0].link);
            client.say(target, "Snippet: " + snippet + "...");
          })
          .catch((e) => {
            console.log(e);
          });
        break;
      case "!live":
        client.say(target, "Yes sir, I am online");
        break;
    }
  }
  //=============================================================================================

  // Chatter's commands
  //=============================================================================================
  if (splitMessage[0].startsWith("!") === true) {
    let command = splitMessage[0].toLowerCase();
    switch (command) {
      case "!lurk":
        onLurkCommand(target, context.username);
        break;
      case "!discord":
        onDiscordCommand(target);
        break;
      case "!socials":
        onSocialsCommand(target);
        break;
      case "!social":
        onSocialsCommand(target);
        break;
      case "!about":
        onAboutCommand(target);
        break;
      case "!glhf":
        onHFGLCommand(target);
        break;
      case "!dono":
        onDonoCommand(target);
        break;
      case "!donate":
        onDonoCommand(target);
        break;
      case "!onlyfriends":
        onOFCommand(target);
        break;
    }
  }
  //=============================================================================================

  //Debugging
  //log every message, remove this eventually, for debugging only
  //=============================================================================================================================================
  // console.log(
  //   "\nChannel: " +
  //     target +
  //     "\nusername: " +
  //     context.username +
  //     "\nmessage: " +
  //     trimmedMessage +
  //     "\nmoderator: " +
  //     context.moderator
  // );
  //=============================================================================================================================================
}

function onOFCommand(target) {
  client.say(
    target,
    "You're looking for my OnlyFriends account? Heres the link! http://bitly.ws/3Vy7"
  );
}

function onDonoCommand(target) {
  client.say(
    target,
    "Don't know what to do with your money? I got you: https://streamlabs.com/token_viper"
  );
}

function onHFGLCommand(target) {
  client.say(
    target,
    "Take the pledge to fight against online toxicity! https://anykey.org/glhf?ref=Q16RCFAM"
  );
}

function onAboutCommand(target) {
  client.say(
    target,
    "Welcome to Token_Viper's Snake Pit! Here you get to watch Token_Viper (aka Jordan) in his natural habitat - his repair shop! He fixes electronics, builds PCs and overall creates content to amuse and captivate the viewers Kappa. I run Huddlle Device Repair in a co-working space, located in Pocatello, Idaho. Jordan may mute his mic from time to time (business stuff LUL ), but don't worry, he won't be gone long!"
  );
}

function onSocialsCommand(target) {
  client.say(
    target,
    // Adjust code here
    "So you want to keep up with me?  \n IG: bigjkos \n Facebook: Jordan Koslosky \n Twitter: @burtongiant13 \n Reddit: TokenViper \n Xbox live - T0kenViper (that's a zero)"
  );
}

// display discord link
function onDiscordCommand(target) {
  client.say(
    target,
    // Adjust code here
    "Keep up with me and the stream and whatever I find interesting in my life HERE: https://discord.gg/UPqcNYu3gt"
  );
}

//
function onLurkCommand(target, lurkUser) {
  client.say(
    target,
    // Adjust code here
    `There @${lurkUser} goes! Thanks for the lurk, remember to mute the tab and not the stream! Come back soon and I'll have cookies!`
  );
}

function onShoutOutCommand(target, shoutOutTarget) {
  try {
    let atRemoval = shoutOutTarget.slice(1);
    client.say(
      target,
      // Adjust code here
      `Wowie! Thanks for the support! Make sure to go check out ${shoutOutTarget}'s channel! Link: https://twitch.tv/${atRemoval}`
    );
  } catch (err) {
    console.log(err);
  }
}

function onClearCommand() {
  try {
    client.clear([process.env.CHANNELS]);
  } catch (err) {
    console.log(err);
  }
}

function limit(string = "", limit = 0) {
  return string.substring(0, limit);
}
