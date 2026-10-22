import { Client } from "discord.js";

import ping from "../events/ping";
import boaNoite from "../events/boaNoite";
import chatIa from "../events/chatIa";
import autoResponse from "../events/autoResponse";

export async function loadEvents(client: Client) {
  ping(client);
  boaNoite(client);
  chatIa(client);
  autoResponse(client);
}
