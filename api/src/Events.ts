import { S } from "api/lib.js"
import type { Schema } from "effect-app/Schema"

export class BogusEvent extends S.ExtendedTaggedClass<BogusEvent, BogusEvent.From>()("BogusEvent", {
  id: S.StringId.withDefault,
  at: S.Date.withDefault
}) {}

export const ClientEvents = S.Union(BogusEvent)
export type ClientEvents = Schema.Type<typeof ClientEvents>

// codegen:start {preset: model}
//
/* eslint-disable */
export namespace BogusEvent {
  export interface From extends S.Struct.Encoded<typeof BogusEvent["fields"]> {}
}
/* eslint-enable */
//
// codegen:end
//
