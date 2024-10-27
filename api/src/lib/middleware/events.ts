import { makeSSE } from "@effect-app/infra/api/middlewares"
import { ClientEvents } from "api/Domain/Events.js"
import { Events } from "api/services.js"
import { Effect } from "effect-app"

export const makeEvents = Events.pipe(Effect.map((events) => makeSSE(events.stream, ClientEvents)))
