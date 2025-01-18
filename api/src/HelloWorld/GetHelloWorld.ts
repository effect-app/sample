import { UserView } from "#Accounts/UserView"
import { handlerFor } from "#api/lib/handler"
import { S } from "#resources/lib"
import { getRequestContext } from "@effect-app/infra/api/setupRequest"
import { RequestContext } from "@effect-app/infra/RequestContext"
import { generate } from "@effect-app/infra/test"
import { Effect } from "effect-app"
import { User } from "../Accounts/models.js"
import { UserRepo } from "../Accounts/UserRepo.js"

class Response extends S.Class<Response>()({
  now: S.Date.withDefault,
  echo: S.String,
  context: RequestContext,
  currentUser: S.NullOr(UserView),
  randomUser: UserView
}) {}

export class GetHelloWorld extends S.Req<GetHelloWorld>()("HelloWorld.GetHelloWorld", {
  echo: S.String
}, { allowAnonymous: true, allowRoles: ["user"], success: Response }) {}

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
