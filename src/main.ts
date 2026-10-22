import "dotenv/config";

import { Client, Collection, GatewayIntentBits } from "discord.js";
import { Command } from "./types/Commands";
import { loadCommands } from "./handlers/commandHandler";
import { loadEvents } from "./handlers/eventHandler";
import { loginCharacterAI } from "./services/characterAI";
import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = 0;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command>;
  }
}

client.commands = new Collection();

(async () => {
  try {
    await loginCharacterAI();
    await loadCommands(client);
    await loadEvents(client);

    await client.login(process.env.DISCORD_TOKEN);

    console.log("Bot iniciado.");
  } catch (error) {
    console.error("Erro ao iniciar bot:", error);
  }
})();

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});
