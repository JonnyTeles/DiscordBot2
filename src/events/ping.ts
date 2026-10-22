import {
    Client,
    Message
} from "discord.js";

export default (client: Client) => {

    client.on("messageCreate", async (message: Message) => {

        if (message.author.bot) return;

        if (message.content === "!ping") {
            await message.reply("pong");
        }

    });

};