import { RequestContext } from "@effect-app/infra/RequestContext"
import { S } from "api/lib.js"
import { UserView } from "api/Users/UserView.js"

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
