import { handlerFor } from "#api/lib/handler"
import { OperationsDefault } from "#api/lib/layers"
import { Operations } from "#api/services"
import { Effect } from "effect-app"
import { FindOperation } from "./FindOperation.request.js"

export default handlerFor(FindOperation)({
  dependencies: [OperationsDefault],
  effect: Effect.gen(function*() {
    const operations = yield* Operations

    return ({ id }) =>
      operations
        .find(id)
        .pipe(Effect.andThen((_) => _.value ?? null))
  })
})
