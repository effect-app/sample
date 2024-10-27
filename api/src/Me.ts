import { matchFor } from "api/lib/routing.js"
import { Effect } from "effect-app"
import { MeResources } from "resources.js"
import { UserRepo } from "./User/UserRepo.js"

export default matchFor(MeResources)([
  UserRepo.Default
], ({ GetMe }) =>
  Effect.gen(function*() {
    const userRepo = yield* UserRepo
    return {
      GetMe: GetMe(userRepo.getCurrentUser)
    }
  }))
