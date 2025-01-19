import { S } from "#resources/lib"
import { NotFoundError } from "effect-app/client"
import { User } from "./models.js"

export class GetMe extends S.Req<GetMe>()("Accounts.GetMe", {}, { success: User, failure: NotFoundError }) {}
