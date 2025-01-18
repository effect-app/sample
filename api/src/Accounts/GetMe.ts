import { handlerFor } from "#api/lib/handler"
import { S } from "#resources/lib"
import { Effect } from "effect-app"
import { NotFoundError } from "effect-app/client"
import { User } from "./models.js"
import { UserRepo } from "./UserRepo.js"

export class GetMe extends S.Req<GetMe>()("Accounts.GetMe", {}, { success: User, failure: NotFoundError }) {}

export default handlerFor(GetMe)({
  dependencies: [UserRepo.Default],
  effect: Effect.gen(function*() {
    const userRepo = yield* UserRepo

    return userRepo.getCurrentUser
  })
})
