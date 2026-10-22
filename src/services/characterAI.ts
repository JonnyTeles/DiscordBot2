import { CharacterAI } from "node_characterai";

export const characterAI = new CharacterAI();

export let dm: any;

export async function loginCharacterAI() {
  try {
    await characterAI.authenticate(process.env.CHARACTER_AI_TOKEN!).catch(err => console.error(err));

    const character = await characterAI.fetchCharacter(
      process.env.CHARACTER_ID!,
    );

    dm = await character.createDM().catch(err => console.error(err));

    console.log("Character AI conectado.");
    console.log("Conversa global criada.");
  } catch (error) {
    console.error(error);
  }
}
