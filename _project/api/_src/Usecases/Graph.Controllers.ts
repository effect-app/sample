/**
 * @experimental
 */

import { BasicRequestEnv } from "@effect-app-boilerplate/messages/RequestLayers"
import { GraphRsc } from "@effect-app-boilerplate/resources"
import type { GraphMutationResponse } from "@effect-app-boilerplate/resources/Graph/Mutation"
import type { GraphQueryRequest, GraphQueryResponse } from "@effect-app-boilerplate/resources/Graph/Query"
import { dropUndefined } from "@effect-app/core/utils"
import { makeRequestId, RequestContext } from "@effect-app/infra/RequestContext"
import { RequestContextContainer } from "@effect-app/infra/services/RequestContextContainer"
import type { CTX } from "api/lib/routing.js"
import { BlogControllers } from "./Blog.Controllers.js"

// TODO: Apply roles&rights to individual actions.

const NoResponse = Effect(undefined)

function request<Key extends string>(
  req: Partial<Record<Key, { input?: any } | undefined>>,
  context: CTX
) {
  return <RKey extends Key, R, E, A>(
    name: RKey,
    handler: (inp: any, ctx: CTX) => Effect<R, E, A>
  ) => {
    const q = req[name]
    return q
      ? Effect.gen(function*($) {
        yield* $(RequestContextContainer.accessWithEffect(_ =>
          _.update(ctx =>
            RequestContext.inherit(ctx, {
              id: makeRequestId(),
              locale: ctx.locale,
              name: ReasonableString(name) // TODO: Use name from handler.Request
            })
          )
        ))

        const ctx = yield* $(RequestContextContainer.get)

        const r = yield* $(
          handler(q.input ?? {}, { ...context, context: ctx }).provideSomeContextEffect(
            BasicRequestEnv
          )
        )
        return r
      })["|>"](Effect.either)
      : NoResponse
  }
}

const { controllers, matchWithEffect } = matchFor(GraphRsc)

// TODO: Auto generate from the clients
const Query = matchWithEffect("Query")(
  Effect.gen(function*($) {
    const blogPostControllers = yield* $(BlogControllers)
    return (req, ctx) =>
      Effect.gen(function*($) {
        const handle = request(req, ctx)
        const r: GraphQueryResponse = yield* $(
          Effect.all({
            // TODO: AllMe currently has a temporal requirement; it must be executed first. (therefore atm requested first..)
            // for two reasons: 1. create the user if it didnt exist yet.
            // 2. because if the user changes locale, its stored on the user object, and put in cache for the follow-up handlers.
            // AllMe: handle("AllMe", AllMe.h),
            // AllMeCommentActivity: handle("AllMeCommentActivity", AllMeCommentActivity.h),
            // AllMeChangeRequests: handle("AllMeChangeRequests", AllMeChangeRequests.h),
            // AllMeEventlog: handle("AllMeEventlog", AllMeEventlog.h),
            // AllMeTasks: handle("AllMeTasks", AllMeTasks.h),

            // FindPurchaseOrder: handle("FindPurchaseOrder", FindPurchaseOrder.h)
            FindBlogPost: handle("FindBlogPost", blogPostControllers.FindPost.h)
          })
        )
        return dropUndefined(r as any) // TODO: Fix optional encoder should ignore undefined values!
      })
  })
)

const emptyResponse = Effect(undefined)

function mutation<Key extends string>(
  req: Partial<Record<Key, { input?: any; query?: GraphQueryRequest } | undefined>>,
  ctx: CTX
) {
  const f = request(req, ctx)
  return <RKey extends Key, R, E, A, R2, E2, A2>(
    name: RKey,
    handler: (inp: any, ctx: CTX) => Effect<R, E, A>,
    resultQuery?: (inp: A, ctx: CTX) => Effect<R2, E2, A2>
  ) => {
    const q = req[name]
    return f(name, handler).flatMap(x =>
      !x
        ? Effect(x)
        : x.isLeft()
        ? Effect(x)
        : (q?.query
          ? Effect.all({
            query: Query.flatMap(_ => _(q.query!, ctx)),
            result: resultQuery ? resultQuery(x.right, ctx) : emptyResponse
          }).map(({ query, result }) => ({ ...query, result })) // TODO: Replace $ variables in the query parameters baed on mutation output!
          : emptyResponse).map(query => Either(query ? { query, response: x.right } : { response: x.right }))
    )
  }
}

const Mutation = matchWithEffect("Mutation")(
  Effect.gen(function*($) {
    const blogPostControllers = yield* $(BlogControllers)
    return (req, ctx) =>
      Effect.gen(function*($) {
        const handle = mutation(req, ctx)
        const r: GraphMutationResponse = yield* $(
          Effect.all({
            CreatePost: handle(
              "CreatePost",
              blogPostControllers.CreatePost.h,
              (id, ctx) =>
                blogPostControllers.FindPost.h({ id }, ctx)
                  .flatMap(x => (!x ? Effect.die("Post went away?") : Effect(x)))
            )
            // UpdatePurchaseOrder: handle("UpdatePurchaseOrder", UpdatePurchaseOrder.h, () =>
            //   FindPurchaseOrder.h(req.UpdatePurchaseOrder!.input).flatMap(x =>
            //     !x ?
            //       Effect.die("PO went away?") :
            //       Effect(x)
            //   ))
          })
        )
        return dropUndefined(r as any) // TODO: Fix optional encoder should ignore undefined values!
      })
  })
)

// TODO: Implement for mutations, with optional query on return
// function createAndRetrievePO() {
//   const mutation = {
//     "PurchaseOrders.Create": {
//       input: { title: "dude" },
//       // optional
//       query: {
//         "PurchaseOrders.Get": {
//           input: {
//             id: "$id" /* $ prefix means it should be taken from response output */,
//           },
//         },
//       },
//     },
//   }
//   type Response = {
//     "PurchaseOrders.Create": Either<
//       MutationError,
//       {
//         result: {
//           id: "some id"
//         }
//         query: {
//           "PurchaseOrders.Get": Either<
//             QueryError,
//             {
//               id: "some id"
//               title: "dude"
//             }
//           >
//         }
//       }
//     >
//   }
// }

export const GraphControllers = controllers({ Query, Mutation })

// export const GraphControllers = Effect.struct({
//   GraphQuery: match(GraphQuery, defaultErrorHandler, handleRequestEnv),
//   GraphMutation: match(GraphMutation, defaultErrorHandler, handleRequestEnv)
// })
