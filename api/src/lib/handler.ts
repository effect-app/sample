import type { Effect, Layer, S } from "effect-app"
import type { TaggedRequestClassAny } from "effect-app/client"

// TODO
export declare const handlerFor: <Req extends TaggedRequestClassAny>(
  r: Req
) => {
  // TODO: constrain L to be strict; only layers that are used in effect, or the other way around
  <const L extends readonly Layer.Layer.Any[], R, E, R2, E2>(
    hndlr: {
      dependencies?: L
      effect: Effect<(req: S.Schema.Type<Req>) => Effect<S.Schema.Type<Req["success"]>, E2, R2>, E, R>
    }
  ): typeof hndlr
  <const L extends readonly Layer.Layer.Any[], R, E, R2, E2>(
    hndlr: {
      dependencies?: L
      effect: Effect<Effect<S.Schema.Type<Req["success"]>, E2, R2>, E, R>
    }
  ): typeof hndlr
} // TODO: as Layer?
