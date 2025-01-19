import { handlerFor } from "#api/lib/handler"
import { S } from "#resources/lib"
import { getRequestContext } from "@effect-app/infra/api/setupRequest"
import { generate } from "@effect-app/infra/test"
import { Effect } from "effect-app"
import { User } from "../Accounts/models.js"
import { UserRepo } from "../Accounts/UserRepo.js"
import { GetHelloWorld } from "./GetHelloWorld.resource.js"

export default handlerFor(GetHelloWorld)({
  dependencies: [UserRepo.Default],
  effect: Effect.gen(function*() {
    const userRepo = yield* UserRepo

    return ({ echo }) =>
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
