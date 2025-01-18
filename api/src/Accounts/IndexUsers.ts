import { handlerFor } from "#api/lib/handler"
import { Q } from "#api/services"
import { S } from "#resources/lib"
import { Array, Effect, Order } from "effect-app"
import { UserId } from "./models.js"
import { UserRepo } from "./UserRepo.js"
import { UserView } from "./UserView.js"

export class IndexUsers extends S.Req<IndexUsers>()("Accounts.IndexUsers", {
  filterByIds: S.NonEmptyArray(UserId)
}, {
  allowAnonymous: true,
  allowRoles: ["user"],
  success: S.Struct({
    users: S.Array(UserView)
  })
}) {}

export default handlerFor(IndexUsers)({
  dependencies: [UserRepo.Default],
  effect: Effect.gen(function*() {
    const userRepo = yield* UserRepo

    return (req) =>
      userRepo
        .query(Q.where("id", "in", req.filterByIds))
        .pipe(Effect.andThen((users) => ({
          users: Array.sort(users, Order.mapInput(Order.string, (_: UserView) => _.displayName))
        })))
  })
})
