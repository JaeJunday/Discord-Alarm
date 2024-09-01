const { Client, GatewayIntentBits } = require("discord.js");
const { CronJob } = require("cron");
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);
