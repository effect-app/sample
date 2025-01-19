import { matchFor, Router } from "#api/lib/routing"
import { HelloWorldRsc } from "#resources"
import { GetHelloWorld } from "#resources/HelloWorld"
import { getRequestContext } from "@effect-app/infra/api/setupRequest"
import { generate } from "@effect-app/infra/test"
import { Effect, S } from "effect-app"
import { User } from "./Accounts/User.js"
import { UserRepo } from "./Accounts/UserRepo.js"

export default Router(HelloWorldRsc)({
  dependencies: [UserRepo.Default],
  effect: Effect.gen(function*() {
    const userRepo = yield* UserRepo

    return matchFor(HelloWorldRsc)({
      GetHelloWorld: ({ echo }) =>
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
    })
  })
})
