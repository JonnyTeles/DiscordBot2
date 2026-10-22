import { Client, Message } from "discord.js";

import { dm } from "../services/characterAI";

const messagesBuffer = new Map<string, string[]>();

export default (client: Client) => {
  client.on("messageCreate", async (message: Message) => {
    if (message.author.bot) return;

    const channelId = message.channel.id;

    if (!messagesBuffer.has(channelId)) {
      messagesBuffer.set(channelId, []);
    }

    messagesBuffer
      .get(channelId)
      ?.push(`${message.author.displayName}: ${message.content}`);
  });

  setInterval(
    async () => {
      for (const [channelId, messages] of messagesBuffer) {
        try {
          if (messages.length < 5) continue;

          const context = messages.join("\n");

          const response = await dm.sendMessage(`

Conversa recente:

${context}

Analise a conversa.

Se não houver motivo para participar, responda APENAS:

IGNORE

Caso queira participar, responda com UMA única mensagem como se estivesse conversando normalmente no canal (pode ser resposta agressiva bem estilo BUDARP).
`);

          const content = response.content?.trim();

          if (!content || content.toUpperCase() === "IGNORE") {
            messagesBuffer.set(channelId, []);
            continue;
          }

          const channel = await client.channels.fetch(channelId);

          if (channel?.isSendable()) {
            await channel.send(content.replaceAll('@everyone', 'everyone').replaceAll('@here', "here"));
          }

          messagesBuffer.set(channelId, []);
        } catch (error) {
          console.error("Erro ao gerar resposta automática:", error);
        }
      }
    },
    5 * 60 * 1000,
  );
};
