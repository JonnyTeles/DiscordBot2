import { Client, Message } from "discord.js";
import { dm } from "../services/characterAI";

const messagesBuffer = new Map<string, string[]>();
let isProcessing = false;

export default (client: Client) => {
  client.on("messageCreate", (message: Message) => {
    if (message.author.bot) return;
    if (message.attachments.size > 0) return;

    const channelId = message.channel.id;

    if (!messagesBuffer.has(channelId)) {
      messagesBuffer.set(channelId, []);
    }

    messagesBuffer
      .get(channelId)!
      .push(`${message.author.displayName}: ${message.content}`);
  });

  const processMessages = async () => {
    if (isProcessing) return;

    isProcessing = true;

    try {
      for (const [channelId, messages] of messagesBuffer) {
        if (messages.length < 5) continue;

        const batch = messages.slice();

        console.log(
          `[IA] Analisando ${batch.length} mensagens em ${channelId}`,
        );

        try {
          const response = await dm.sendMessage(`
Conversa recente:

${batch.join("\n")}

Analise a conversa.

Se não houver motivo para participar, responda APENAS:

IGNORE

Caso queira participar, responda com UMA única mensagem
como se estivesse conversando normalmente no canal.
OBS: NÃO IGNORE SEMPRE... APENAS 1 EM CADA 5X MAIS OU MENOS MAS NÃO SEMPRE.
`);

          const content = response.content?.trim();

          if (!content) {
            console.warn("[IA] Resposta vazia.");
            continue;
          }

          if (content.toUpperCase() !== "IGNORE") {
            const channel = await client.channels.fetch(channelId);

            if (channel?.isSendable()) {
              await channel.send(
                content
                  .replaceAll("@everyone", "everyone")
                  .replaceAll("@here", "here"),
              );
            } else {
              console.warn(`[IA] Canal indisponível para envio: ${channelId}`);
              continue;
            }
          }

          const currentMessages = messagesBuffer.get(channelId);

          if (currentMessages) {
            currentMessages.splice(0, batch.length);
          }

          console.log(`[IA] Análise concluída em ${channelId}`);
        } catch (error) {
          console.error(`[IA] Erro no canal ${channelId}:`, error);
        }
      }
    } catch (error) {
      console.error("[IA] Erro no processamento:", error);
    } finally {
      isProcessing = false;
    }
  };

  setInterval(
    () => {
      void processMessages();
    },
    15 * 60 * 1000,
  );
};
