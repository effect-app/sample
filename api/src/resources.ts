import type {} from "@effect/platform/HttpClient"

export { ClientEvents } from "./Events.js"

// codegen:start {preset: barrel, include: ./**/*.resources.ts, exclude: [./resources/index.ts, ./resources/lib.ts, ./resources/integrationEvents.ts, ./resources/Messages.ts, ./resources/views.ts, ./resources/Events.ts], export: { as: 'PascalCase' }}
export * as BlogResources from "./Blog/Blog.resources.js"
export * as HelloWorldResources from "./HelloWorld.resources.js"
export * as OperationsResources from "./Operations.resources.js"
export * as MeResources from "./User/Me.resources.js"
export * as UsersResources from "./User/Users.resources.js"
// codegen:end
