import { setupRequestContext } from "@effect-app/infra/api/setupRequest"
import { RequestContext } from "@effect-app/infra/RequestContext"
import { Effect, Option, S } from "effect-app"
import { HttpMiddleware, HttpServerRequest, HttpServerResponse } from "effect-app/http"
import { RequestId } from "effect-app/ids"
import { NonEmptyString255 } from "effect-app/schema"

export const RequestContextMiddleware = HttpMiddleware.make((app) =>
  Effect.gen(function*() {
    const req = yield* HttpServerRequest.ServerRequest

    const currentSpan = yield* Effect.currentSpan.pipe(Effect.orDie)
    const parent = currentSpan?.parent ? Option.getOrUndefined(currentSpan.parent) : undefined
    const start = new Date()
    const supported = ["en", "de"] as const
    const desiredLocale = req.headers["x-locale"]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const locale = desiredLocale && supported.includes(desiredLocale as any)
      ? (desiredLocale as typeof supported[number])
      : ("en" as const)

    const requestId = req.headers["request-id"]
    const rootId = parent?.spanId
      ? RequestId(parent.spanId)
      : requestId
      ? S.decodeUnknownSync(RequestId)(requestId)
      : RequestId.make()

    const storeId = req.headers["x-store-id"]
    const namespace = S.NonEmptyString255((storeId && (Array.isArray(storeId) ? storeId[0] : storeId)) || "primary")

    const requestContext = new RequestContext({
      id: currentSpan?.spanId ? RequestId(currentSpan.spanId) : RequestId.make(),
      rootId,
      name: NonEmptyString255(req.originalUrl), // set more detailed elsewhere
      locale,
      createdAt: start,
      namespace
    })
    const res = yield* setupRequestContext(app, requestContext)

    return HttpServerResponse.setHeaders(res, {
      "request-id": requestContext.rootId,
      "Content-Language": requestContext.locale
    })
  })
)
