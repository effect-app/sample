import { RequestContext } from "@effect-app/infra/RequestContext"
import { UserView } from "api/Accounts/UserView.js"
import { S } from "lib/resources.js"

class Response extends S.Class<Response>()({
  now: S.Date.withDefault,
  echo: S.String,
  context: RequestContext,
  currentUser: S.NullOr(UserView),
  randomUser: UserView
}) {}

export class GetHelloWorld extends S.Req<GetHelloWorld>()("GetHelloWorld", {
  echo: S.String
}, { allowAnonymous: true, allowRoles: ["user"], success: Response }) {}

//// codegen:start {preset: meta, sourcePrefix: src/HelloWorld/}
export const meta = { moduleName: "HelloWorld" } as const
// codegen:end
