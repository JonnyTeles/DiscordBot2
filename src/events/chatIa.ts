import { Client, Message } from "discord.js";
import { dm } from "../services/characterAI";

export default (client: Client) => {
  client.on("messageCreate", async (message: Message) => {
    if (message.author.bot) return;

    if (!message.mentions.has(client.user!)) return;

    const content = message.content
      .replace(`<@${client.user!.id}>`, "")
      .replace(`<@!${client.user!.id}>`, "")
      .trim();

    if (!content) return;
    const response = await dm.sendMessage(
      `${message.author.displayName} diz: ${content}`,
    );

    await message
      .reply(
        response.content
          .replaceAll("@everyone", "everyone")
          .replaceAll("@here", "here"),
      )
      .catch(async (err) => {
        console.error(err);
        await message.reply(`Deu um erro aqui.`);
      });
  });
};
