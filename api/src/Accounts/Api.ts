import { User, UserId } from "Domain/User.js"
import { NotFoundError } from "effect-app/client"
import { S } from "lib/resources.js"
import { UserView } from "./UserView.js"

export class GetMe extends S.Req<GetMe>()("GetMe", {}, { success: User, failure: NotFoundError }) {}

export class Index extends S.Req<Index>()("Index", {
  filterByIds: S.NonEmptyArray(UserId)
}, {
  allowAnonymous: true,
  allowRoles: ["user"],
  success: S.Struct({
    users: S.Array(UserView)
  })
}) {}

//// codegen:start {preset: meta, sourcePrefix: src/User/}
export const meta = { moduleName: "Me" } as const
// codegen:end
