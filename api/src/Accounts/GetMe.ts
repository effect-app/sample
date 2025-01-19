import { handlerFor } from "#api/lib/handler"
import { Effect } from "effect-app"
import { GetMe } from "./GetMe.request.js"
import { UserRepo } from "./UserRepo.js"

export default handlerFor(GetMe)({
  dependencies: [UserRepo.Default],
  effect: Effect.gen(function*() {
    const userRepo = yield* UserRepo

    return userRepo.getCurrentUser
  })
})
