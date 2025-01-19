import { matchFor, Router } from "#api/lib/routing"
import { Q } from "@effect-app/infra/Model"
import { Array, Effect, Order } from "effect-app"
import type { UserView } from "./resources.js"
import { AccountsRsc } from "./resources.js"
import { UserRepo } from "./UserRepo.js"

export default Router(AccountsRsc)({
  dependencies: [UserRepo.Default],
  effect: Effect.gen(function*() {
    const userRepo = yield* UserRepo

    return matchFor(AccountsRsc)({
      GetMe: userRepo.getCurrentUser,
      IndexUsers: (req) =>
        userRepo
          .query(Q.where("id", "in", req.filterByIds))
          .pipe(Effect.andThen((users) => ({
            users: Array.sort(users, Order.mapInput(Order.string, (_: UserView) => _.displayName))
          })))
    })
  })
})
