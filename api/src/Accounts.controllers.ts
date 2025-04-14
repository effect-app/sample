import { matchFor, Router } from "#lib/routing"
import { AccountsRsc } from "#resources"
import { UserRepo } from "#services"
import { Effect } from "effect-app"

export default Router(AccountsRsc)({
  dependencies: [UserRepo.Default],
  effect: Effect.gen(function*() {
    const userRepo = yield* UserRepo

    return matchFor(AccountsRsc)({
      GetMe: userRepo.getCurrentUser
    })
  })
})
