import { UserId } from "api/Domain/User.js"
import { S } from "api/lib.js"
import { UserView } from "./UserView.js"

export class IndexUsers extends S.Req<IndexUsers>()("IndexUsers", {
  filterByIds: S.NonEmptyArray(UserId)
}, {
  allowAnonymous: true,
  allowRoles: ["user"],
  success: S.Struct({
    users: S.Array(UserView)
  })
}) {}

//// codegen:start {preset: meta, sourcePrefix: src/User/}
export const meta = { moduleName: "Users" } as const
// codegen:end
