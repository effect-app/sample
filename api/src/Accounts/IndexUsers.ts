import { handlerFor } from "#api/lib/handler"
import { Q } from "#api/services"
import { Array, Effect, Order } from "effect-app"
import { IndexUsers } from "./IndexUsers.resource.js"
import { UserRepo } from "./UserRepo.js"
import type { UserView } from "./views.js"

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
