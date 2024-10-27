import type {} from "@effect/platform/HttpClient"

// codegen:start {preset: barrel, include: './[A-Z]*/Api.ts', import: star}
import * as accountsApi from "./Accounts/Api.js"
import * as blogApi from "./Blog/Api.js"
import * as helloWorldApi from "./HelloWorld/Api.js"
import * as operationsApi from "./Operations/Api.js"

export { accountsApi, blogApi, helloWorldApi, operationsApi }
// codegen:end
