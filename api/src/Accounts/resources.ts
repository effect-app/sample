import { User, UserId } from "#Domain/User"
import { S } from "#resources/lib"
import { NotFoundError } from "effect-app/client"

export class UserView extends S.ExtendedClass<UserView, UserView.Encoded>()({
  ...User.pick("id", "role"),
  displayName: S.NonEmptyString2k
}) {}

export class GetMe extends S.Req<GetMe>()("GetMe", {}, { success: User, failure: NotFoundError }) {}

export class IndexUsers extends S.Req<IndexUsers>()("IndexUsers", {
  filterByIds: S.NonEmptyArray(UserId)
}, {
  allowAnonymous: true,
  allowRoles: ["user"],
  success: S.Struct({
    users: S.Array(UserView)
  })
}) {}

// codegen:start {preset: meta, sourcePrefix: src/}
export const meta = { moduleName: "Accounts" } as const
// codegen:end

// codegen:start {preset: model}
//
/* eslint-disable */
export namespace UserView {
  export interface Encoded extends S.Struct.Encoded<typeof UserView["fields"]> {}
}
/* eslint-enable */
//
// codegen:end
//

export * as AccountsRsc from "./resources.js"
