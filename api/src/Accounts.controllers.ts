import { matchFor, Router } from "#api/lib/routing"
import { AccountsRsc } from "#resources"
import { Effect } from "effect-app"
import { UserRepo } from "./Accounts/UserRepo.js"

export default Router(AccountsRsc)({
  dependencies: [UserRepo.Default],
  effect: Effect.gen(function*() {
    const userRepo = yield* UserRepo

    return matchFor(AccountsRsc)({
      GetMe: userRepo.getCurrentUser
    })
  })
})
