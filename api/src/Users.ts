import { matchFor } from "api/lib/routing.js"
import { Q } from "api/services.js"
import { Array } from "effect"
import { Effect, Order } from "effect-app"
import { UsersResources } from "resources.js"
import { UserRepo } from "./User/UserRepo.js"
import type { UserView } from "./User/UserView.js"

export default matchFor(UsersResources)([
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
