import "@effect-app/fluent-extensions"
import { runMain } from "./lib/basicRuntime.js"

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as DevTools from "@effect/experimental/DevTools"
import { faker } from "@faker-js/faker"
import { api, devApi } from "api/api.js"
import { Layer } from "effect-app"
import { setFaker } from "effect-app/faker"
import { MergedConfig } from "./config.js"
import { TracingLive } from "./observability.js"

setFaker(faker)

const logConfig = MergedConfig.andThen((cfg) => console.debug(`Config: ${JSON.stringify(cfg, undefined, 2)}`))

const program = devApi
  .pipe(
    Layer.provide(api),
    Layer.provide(logConfig.pipe(Layer.scopedDiscard)),
    Layer.provide(DevTools.layer()),
    Layer.provide(TracingLive)
  )

// NOTE: all dependencies should have been provided, for us to be able to run the program.
// if you get a type error here on the R argument, you haven't provided that dependency yet, or not at the appropriate time / location
runMain(Layer.launch(program))
