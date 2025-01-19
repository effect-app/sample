import { S } from "#resources/lib"
import { UserId } from "./models.js"
import { UserView } from "./views.js"

export class IndexUsers extends S.Req<IndexUsers>()("Accounts.IndexUsers", {
  filterByIds: S.NonEmptyArray(UserId)
}, {
  allowAnonymous: true,
  allowRoles: ["user"],
  success: S.Struct({
    users: S.Array(UserView)
  })
}) {}
