/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseConfig } from "#api/config"
import { AppLogger } from "#api/lib/logger"
import { RequestCacheLayers } from "#api/resources/lib"
import { makeMiddleware, makeRouter, RpcHeadersFromHttpHeaders } from "@effect-app/infra/api/routing"
import { NotLoggedInError, UnauthorizedError } from "@effect-app/infra/errors"
import type { RequestContext } from "@effect-app/infra/RequestContext"
import { Rpc } from "@effect/rpc"
import type { Request, S } from "effect-app"
import { Context, Effect, Exit, Layer, Option } from "effect-app"
import type { GetEffectContext, RPCContextMap } from "effect-app/client"
import type { HttpHeaders, HttpServerRequest } from "effect-app/http"
import type * as EffectRequest from "effect/Request"
import { makeUserProfileFromAuthorizationHeader, makeUserProfileFromUserHeader, UserProfile } from "../UserProfile.js"
import { basicRuntime } from "./basicRuntime.js"

export interface CTX {
  context: RequestContext
}

export type CTXMap = {
  allowAnonymous: RPCContextMap.Inverted<"userProfile", UserProfile, typeof NotLoggedInError>
  // TODO: not boolean but `string[]`
  requireRoles: RPCContextMap.Custom<"", never, typeof UnauthorizedError, Array<string>>
}

// export const Auth0Config = Config.all({
//   audience: Config.string("audience").pipe(Config.nested("auth0"), Config.withDefault("http://localhost:3610")),
//   issuer: Config.string("issuer").pipe(
//     Config.nested("auth0"),
//     Config.withDefault("https://effect-app-boilerplate-dev.eu.auth0.com")
//   )
// })

const RequestLayers = Layer.mergeAll(RpcHeadersFromHttpHeaders, RequestCacheLayers)

const middleware = makeMiddleware({
  contextMap: null as unknown as CTXMap,
  // helper to deal with nested generic lmitations
  context: null as any as HttpServerRequest.HttpServerRequest,
  execute: Effect.gen(function*() {
    const fakeLogin = true
    // const authConfig = yield* Auth0Config
    const makeUserProfile = fakeLogin
      ? ((headers: HttpHeaders.Headers) =>
        headers["x-user"] ? makeUserProfileFromUserHeader(headers["x-user"]) : Effect.succeed(undefined))
      : ((headers: HttpHeaders.Headers) =>
        headers["authorization"]
          ? makeUserProfileFromAuthorizationHeader(headers["authorization"])
          : Effect.succeed(undefined))

    return <T extends { config?: { [K in keyof CTXMap]?: any } }, Req extends S.TaggedRequest.All, R>(
      schema: T & S.Schema<Req, any, never>,
      handler: (request: Req) => Effect.Effect<EffectRequest.Request.Success<Req>, EffectRequest.Request.Error<Req>, R>,
      moduleName?: string
    ) => {
      const ContextLayer = <Req extends { _tag: string }>(req: Req) =>
        Effect
          .gen(function*() {
            yield* Effect.annotateCurrentSpan("request.name", moduleName ? `${moduleName}.${req._tag}` : req._tag)

            const headers = yield* Rpc.currentHeaders
            const config = "config" in schema ? schema.config : undefined
            let ctx = Context.empty()

            // Check JWT
            // TODO
            // if (!fakeLogin && !request.allowAnonymous) {
            //   yield* Effect.catchAll(
            //     checkJWTI({
            //       ...authConfig,
            //       issuer: authConfig.issuer + "/",
            //       jwksUri: `${authConfig.issuer}/.well-known/jwks.json`
            //     }),
            //     (err) => Effect.fail(new JWTError({ error: err }))
            //   )
            // }

            const r = yield* Effect.exit(makeUserProfile(headers))
            if (!Exit.isSuccess(r)) {
              yield* AppLogger.logWarning("Parsing userInfo failed").pipe(Effect.annotateLogs("r", r))
            }
            const userProfile = Option.fromNullable(Exit.isSuccess(r) ? r.value : undefined)
            if (Option.isSome(userProfile)) {
              ctx = ctx.pipe(Context.add(UserProfile, userProfile.value))
            } else if (!config?.allowAnonymous) {
              return yield* new NotLoggedInError({ message: "no auth" })
            }

            if (config?.requireRoles) {
              // TODO
              if (
                !userProfile.value
                || !(config.requireRoles as any).every((role: any) => userProfile.value!.roles.includes(role))
              ) {
                return yield* new UnauthorizedError()
              }
            }

            return ctx as Context.Context<GetEffectContext<CTXMap, T["config"]>>
          })
          .pipe(Layer.effectContext, Layer.provide(RequestLayers))
      return (req: Req): Effect.Effect<
        Request.Request.Success<Req>,
        Request.Request.Error<Req>,
        | HttpServerRequest.HttpServerRequest
        | Exclude<R, GetEffectContext<CTXMap, T["config"]>>
      > =>
        handler(req).pipe(
          Effect.provide(ContextLayer(req))
        ) as any
    }
  })
})

const baseConfig = basicRuntime.runSync(BaseConfig)
export const { Router, matchAll, matchFor } = makeRouter(middleware, baseConfig.env !== "prod")
