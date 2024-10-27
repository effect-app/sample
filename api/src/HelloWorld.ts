import { getRequestContext } from "@effect-app/infra/api/setupRequest"
import { generate } from "@effect-app/infra/test"
import { matchFor } from "api/lib/routing.js"
import { Effect, S } from "effect-app"
import { HelloWorldApi } from "resources.js"
import { UserRepo } from "./Accounts/UserRepo.js"
import { User } from "./Domain/User.js"

export default matchFor(HelloWorldApi)([
  UserRepo.Default
], ({ GetHelloWorld }) =>
  Effect.gen(function*() {
    const userRepo = yield* UserRepo

    return {
      GetHelloWorld: GetHelloWorld(({ echo }) =>
        Effect.gen(function*() {
          const context = yield* getRequestContext
          return yield* userRepo
            .tryGetCurrentUser
            .pipe(
              Effect.catchTags({
                "NotLoggedInError": () => Effect.succeed(null),
                "NotFoundError": () => Effect.succeed(null)
              }),
              Effect.andThen((user) =>
                new GetHelloWorld.success({
                  context,
                  echo,
                  currentUser: user,
                  randomUser: generate(S.A.make(User)).value
                })
              )
            )
        })
      )
    }
  }))
