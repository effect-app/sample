import { UserView } from "#Accounts/views"
import { S } from "#resources/lib"
import { RequestContext } from "@effect-app/infra/RequestContext"

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
