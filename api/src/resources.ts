import "./resources/lib/operations.js"
import type {} from "@effect/platform/Http/Client"

export { ClientEvents } from "./resources/Events.js"

// codegen:start {preset: barrel, include: ./resources/*.ts, exclude: [./resources/_global*.ts, ./resources/index.ts, ./resources/lib.ts, ./resources/integrationEvents.ts, ./resources/Messages.ts, ./resources/Views.ts, ./resources/errors.ts, ./resources/Events.ts], export: { as: 'PascalCase', postfix: 'Rsc' }}
export * as BlogRsc from "./resources/Blog.js"
export * as HelloWorldRsc from "./resources/HelloWorld.js"
export * as MeRsc from "./resources/Me.js"
export * as OperationsRsc from "./resources/Operations.js"
export * as UsersRsc from "./resources/Users.js"
// codegen:end
