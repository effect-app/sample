import { UserId } from "#Accounts/User"
import { UserView } from "#Accounts/UserView"
import { S } from "./lib.js"

export class IndexUsers extends S.Req<IndexUsers>()("IndexUsers", {
  filterByIds: S.NonEmptyArray(UserId)
}, {
  allowAnonymous: true,
  allowRoles: ["user"],
  success: S.Struct({
    users: S.Array(UserView)
  })
}) {}

// codegen:start {preset: meta, sourcePrefix: src/resources/}
export const meta = { moduleName: "Users" } as const
// codegen:end
