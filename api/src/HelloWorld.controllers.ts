import { getRequestContext } from "@effect-app/infra/api/setupRequest"
import { generate } from "@effect-app/infra/test"
import { matchFor } from "api/lib/routing.js"
import { Effect, S } from "effect-app"
import { HelloWorldResources } from "resources.js"
import { User } from "./User/User.js"
import { UserRepo } from "./User/UserRepo.js"

export default matchFor(HelloWorldResources)([
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
