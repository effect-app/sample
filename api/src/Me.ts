import { matchFor } from "api/lib/routing.js"
import { Effect } from "effect-app"
import { meApi } from "resources.js"
import { UserRepo } from "./Users/UserRepo.js"

export default matchFor(meApi)([
  UserRepo.Default
], ({ GetMe }) =>
  Effect.gen(function*() {
    const userRepo = yield* UserRepo
    return {
      GetMe: GetMe(userRepo.getCurrentUser)
    }
  }))
