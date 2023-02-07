import type { Property, PropertyRecord, SchemaAny, SchemaProperties } from "@effect-app/prelude/schema"

export function makeInput<Self extends SchemaAny>(
  a: Self
): SchemaProperties<{
  input: Property<Self, "required", None, None>
}>
export function makeInput<Self extends SchemaAny>(
  a: Self,
  noInput: true
): SchemaProperties<{
  input: Property<Self, "optional", None, None>
}>
export function makeInput<Self extends SchemaAny>(a: Self, noInput?: boolean): any {
  return props(noInput ? { input: optProp(a) } : { input: prop(a) })
}

export function makeMutationInput<Props extends PropertyRecord>(baseSchemaProps: Props) {
  return <Self extends SchemaAny>(a: Self) => {
    const query = props({ ...baseSchemaProps, result: optProp(bool) })
    return props({ input: prop(a), query: optProp(query) })
  }
}
