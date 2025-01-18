import { handlerFor } from "#api/lib/handler"
import { OperationsDefault } from "#api/lib/layers"
import { Operations } from "#api/services"
import { S } from "#resources/lib"
import { Effect } from "effect-app"
import { Operation, OperationId } from "effect-app/Operations"

export class FindOperation extends S.Req<FindOperation>()("Operations.FindOperation", {
  id: OperationId
}, { allowAnonymous: true, allowRoles: ["user"], success: S.NullOr(Operation) }) {}

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
