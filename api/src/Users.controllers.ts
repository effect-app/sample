import { Router } from "#lib/routing"
import { User } from "#models/User"
import { UsersRsc } from "#resources"
import { UserView } from "#resources/views/UserView"
import { Q, UserRepo } from "#services"
import { Array } from "effect"
import { Effect, Order } from "effect-app"

export default Router(UsersRsc)({
  dependencies: [UserRepo.Default],
  *effect(match) {
    const userRepo = yield* UserRepo

    return match({
      IndexUsers: (req) =>
        userRepo
          .query(Q.where("id", "in", req.filterByIds))
          .pipe(Effect.map((users) => ({
            users: Array.sort(
              users.map((u) => UserView.make({ id: u.id, role: u.role, displayName: User.displayName(u) })),
              Order.mapInput(Order.String, (_: UserView) => _.displayName)
            )
          })))
    })
  }
})
