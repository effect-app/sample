import type {} from "@effect/platform/HttpClient"

//// codegen:start {preset: barrel, include: './[A-Z]*/Api.ts', import: star}
import * as AccountsApi from "./Accounts/Api.js"
import * as BlogApi from "./Blog/Api.js"
import * as HelloWorldApi from "./HelloWorld/Api.js"
import * as OperationsApi from "./Operations/Api.js"

export { AccountsApi, BlogApi, HelloWorldApi, OperationsApi }
// codegen:end
