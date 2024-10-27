import type {} from "@effect/platform/HttpClient"

// codegen:start {preset: barrel, include: './[A-Z]*/Api.ts', import: star}
import * as blogApi from "./Blog/Api.js"
import * as helloWorldApi from "./HelloWorld/Api.js"
import * as meApi from "./Me/Api.js"
import * as operationsApi from "./Operations/Api.js"
import * as usersApi from "./Users/Api.js"

export { blogApi, helloWorldApi, meApi, operationsApi, usersApi }
// codegen:end
