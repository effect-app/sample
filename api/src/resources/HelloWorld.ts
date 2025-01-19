import { UserView } from "#Accounts/UserView"
import { RequestContext } from "@effect-app/infra/RequestContext"
import { S } from "./lib.js"

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

// codegen:start {preset: meta, sourcePrefix: src/resources/}
export const meta = { moduleName: "HelloWorld" } as const
// codegen:end
