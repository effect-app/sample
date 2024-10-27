import { User, UserId } from "api/Domain/User.js"
import { S } from "api/lib.js"
import { NotFoundError } from "effect-app/client"
import { UserView } from "./UserView.js"

export class GetMe extends S.Req<GetMe>()("GetMe", {}, { success: User, failure: NotFoundError }) {}

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
export const meta = { moduleName: "Me" } as const
// codegen:end
