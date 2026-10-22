import "dotenv/config";

import {
  REST,
  Routes
} from "discord.js";

import ping from "./commands/ping";

const commands = [
  ping.data.toJSON()
];

(async () => {

  console.log(
    `[DEPLOY] ${commands.length} comando(s) encontrado(s).`
  );

  const rest = new REST({
    version: "10"
  }).setToken(process.env.DISCORD_TOKEN!);

  try {

    await rest.put(
      Routes.applicationCommands(
        process.env.CLIENT_ID!
      ),
      {
        body: commands
      }
    );

    console.log(
      `[DEPLOY] ${commands.length} comando(s) enviado(s) para o Discord.`
    );

  }
  catch (error) {

    console.error(error);

  }

})();