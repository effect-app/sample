import { S } from "#resources/lib"
import { Operation, OperationId } from "effect-app/Operations"

export class FindOperation extends S.Req<FindOperation>()("Operations.FindOperation", {
  id: OperationId
}, { allowAnonymous: true, allowRoles: ["user"], success: S.NullOr(Operation) }) {}
