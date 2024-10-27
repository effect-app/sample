import { S } from "api/lib.js"
import { User } from "./User.js"

export class UserView extends S.ExtendedClass<UserView, UserView.From>()({
  ...User.pick("id", "role"),
  displayName: S.NonEmptyString2k
}) {}

// codegen:start {preset: model}
//
/* eslint-disable */
export namespace UserView {
  export interface From extends S.Struct.Encoded<typeof UserView["fields"]> {}
}
/* eslint-enable */
//
// codegen:end
//
