import { OperationsDefault } from "api/lib.js"
import { matchFor } from "api/lib/routing.js"
import { Operations } from "api/services.js"
import { Effect } from "effect-app"
import { operationsApi } from "resources.js"

export default matchFor(operationsApi)([
  OperationsDefault
], ({ FindOperation }) =>
  Effect.gen(function*() {
    const operations = yield* Operations
    return {
      FindOperation: FindOperation(
        ({ id }) =>
          operations
            .find(id)
            .pipe(Effect.andThen((_) => _.value ?? null))
      )
    }
  }))
