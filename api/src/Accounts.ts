import { matchFor } from "api/lib/routing.js"
import { Array, Effect, Order } from "effect-app"
import { accountsApi } from "resources.js"
import { UserRepo } from "./Accounts/UserRepo.js"
import type { UserView } from "./Accounts/UserView.js"
import { Q } from "./services.js"

export default matchFor(accountsApi)([
  UserRepo.Default
], ({ GetMe, Index }) =>
  Effect.gen(function*() {
    const userRepo = yield* UserRepo
    return {
      GetMe: GetMe(userRepo.getCurrentUser),
      Index: Index((req) =>
        userRepo
          .query(Q.where("id", "in", req.filterByIds))
          .pipe(Effect.andThen((users) => ({
            users: Array.sort(users, Order.mapInput(Order.string, (_: UserView) => _.displayName))
          })))
      )
    }
  }))
