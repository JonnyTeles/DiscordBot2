import { Client } from "discord.js";

import ping from "../commands/ping";

export async function loadCommands(client: Client) {
  client.commands.set(ping.data.name, ping);

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);

      const payload = {
        content: "Erro ao executar comando.",
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(payload);
      } else {
        await interaction.reply(payload);
      }
    }
  });
}
