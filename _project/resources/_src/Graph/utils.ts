import type { Property, PropertyRecord, SchemaAny, SchemaProperties } from "@effect-app/prelude/schema"

export function makeInput<Self extends SchemaAny>(
  a: Self
): SchemaProperties<{
  input: Property<Self, "required", None<any>, None<any>>
}>
export function makeInput<Self extends SchemaAny>(
  a: Self,
  noInput: true
): SchemaProperties<{
  input: Property<Self, "optional", None<any>, None<any>>
}>
export function makeInput<Self extends SchemaAny>(a: Self, noInput?: boolean): any {
  return props(noInput ? { input: a.optional } : { input: a })
}

export function makeMutationInput<Props extends PropertyRecord>(baseSchemaProps: Props) {
  return <Self extends SchemaAny>(a: Self) => {
    const query = props({ ...baseSchemaProps, result: bool.optional })
    return props({ input: a, query: query.optional })
  }
}
