import { Router } from "#lib/routing"
import { OperationsRsc } from "#resources"
import { Operations } from "#services"
import { Effect } from "effect-app"
import { OperationsDefault } from "./lib/layers.js"

export default Router(OperationsRsc)({
  dependencies: [OperationsDefault],
  *effect(match) {
    const operations = yield* Operations

    return match({
      FindOperation: ({ id }) =>
        operations
          .find(id)
          .pipe(Effect.andThen((_) => _.value ?? null))
    })
  }
})
