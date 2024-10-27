import { matchFor } from "api/lib/routing.js"
import { Q } from "api/services.js"
import { Array } from "effect"
import { Effect, Order } from "effect-app"
import { usersApi } from "resources.js"
import { UserRepo } from "./Users/UserRepo.js"
import type { UserView } from "./Users/UserView.js"

export default matchFor(usersApi)([
  UserRepo.Default
], ({ IndexUsers }) =>
  Effect.gen(function*() {
    const userRepo = yield* UserRepo
    return {
      IndexUsers: IndexUsers((req) =>
        userRepo
          .query(Q.where("id", "in", req.filterByIds))
          .pipe(Effect.andThen((users) => ({
            users: Array.sort(users, Order.mapInput(Order.string, (_: UserView) => _.displayName))
          })))
      )
    }
  }))
