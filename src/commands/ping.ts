import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../types/Commands";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Responde pong"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("pong");
  },
};

export default command;
