import { storeId } from "@effect-app/infra/services/Store/Memory"
import { Context, Effect, FiberRef, PubSub, Stream } from "effect-app"
import type { NonEmptyReadonlyArray } from "effect/Array"
import type { ClientEvents } from "resources.js"

const makeEvents = Effect.gen(function*() {
  const q = yield* PubSub.unbounded<{ evt: ClientEvents; namespace: string }>()
  const svc = {
    publish: (...evts: NonEmptyReadonlyArray<ClientEvents>) =>
      storeId.pipe(FiberRef.get, Effect.andThen((namespace) => q.offerAll(evts.map((evt) => ({ evt, namespace }))))),
    subscribe: q.subscribe,
    stream: Stream.fromPubSub(q)
  }
  return svc
})

export class Events extends Context.TagMakeId("Events", makeEvents)<Events>() {
  static readonly Live = this.toLayer()
}
