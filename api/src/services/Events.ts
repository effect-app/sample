import { storeId } from "@effect-app/infra/Store/Memory"
import type { ClientEvents } from "api/Domain/Events.js"
import { Effect, FiberRef, PubSub, Stream } from "effect-app"
import type { NonEmptyReadonlyArray } from "effect/Array"

export class Events extends Effect.Service<Events>()("Events", {
  accessors: true,
  effect: Effect.gen(function*() {
    const q = yield* PubSub.unbounded<{ evt: ClientEvents; namespace: string }>()
    const svc = {
      publish: (...evts: NonEmptyReadonlyArray<ClientEvents>) =>
        storeId.pipe(FiberRef.get, Effect.andThen((namespace) => q.offerAll(evts.map((evt) => ({ evt, namespace }))))),
      subscribe: q.subscribe,
      stream: Stream.fromPubSub(q)
    }
    return svc
  })
}) {}
