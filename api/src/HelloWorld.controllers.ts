import { Router } from "#lib/routing"
import { User } from "#models/User"
import { HelloWorldRsc } from "#resources"
import { GetHelloWorld } from "#resources/HelloWorld"
import { getRequestContext } from "@effect-app/infra/api/setupRequest"
import { generate } from "@effect-app/infra/test"
import { Effect, S } from "effect-app"
import { UserRepo } from "./services.js"

export default Router(HelloWorldRsc)({
  dependencies: [UserRepo.Default],
  *effect(match) {
    const userRepo = yield* UserRepo

    return match({
      *GetHelloWorld({ echo }) {
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
      }
    })
  }
})
