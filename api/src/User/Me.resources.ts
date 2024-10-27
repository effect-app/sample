import { User } from "api/Domain/User.js"
import { S } from "api/lib.js"
import { NotFoundError } from "effect-app/client"

export class GetMe extends S.Req<GetMe>()("GetMe", {}, { success: User, failure: NotFoundError }) {}

// codegen:start {preset: meta, sourcePrefix: src/User/}
export const meta = { moduleName: "Me.resources" } as const
// codegen:end
