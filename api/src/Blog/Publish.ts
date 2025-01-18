import { handlerFor } from "#api/lib/handler"
import { OperationsDefault } from "#api/lib/layers"
import { BogusEvent } from "#api/resources/Events"
import { S } from "#api/resources/lib"
import { BlogPostRepo, Events, Operations } from "#api/services"
import { BlogPostId } from "#models/Blog"
import { Duration, Effect, Schedule } from "effect-app"
import { NotFoundError } from "effect-app/client"
import { OperationId } from "effect-app/Operations"
import { NonEmptyString2k, NonNegativeInt } from "effect-app/Schema"

export class Request extends S.Req<Request>()("Blog.PublishPost", {
  id: BlogPostId
}, { allowRoles: ["user"], success: OperationId, failure: S.Union(NotFoundError) }) {}

export default handlerFor(Request)({
  dependencies: [
    BlogPostRepo.Default,
    OperationsDefault,
    Events.Default
  ],
  effect: Effect.gen(function*() {
    const blogPostRepo = yield* BlogPostRepo
    const operations = yield* Operations
    const events = yield* Events

    return (req) =>
      Effect.gen(function*() {
        const post = yield* blogPostRepo.get(req.id)

        console.log("publishing post", post)

        const targets = [
          "google",
          "twitter",
          "facebook"
        ]

        const done: string[] = []

        const op = yield* operations.fork(
          (opId) =>
            operations
              .update(opId, {
                total: NonNegativeInt(targets.length),
                completed: NonNegativeInt(done.length)
              })
              .pipe(
                Effect.andThen(Effect.forEach(targets, (_) =>
                  Effect
                    .sync(() => done.push(_))
                    .pipe(
                      Effect.tap(() =>
                        operations.update(opId, {
                          total: NonNegativeInt(targets.length),
                          completed: NonNegativeInt(done.length)
                        })
                      ),
                      Effect.delay(Duration.seconds(4))
                    ))),
                Effect.andThen(() => "the answer to the universe is 41")
              ),
          // while operation is running...
          (_opId) =>
            Effect
              .suspend(() => events.publish(new BogusEvent()))
              .pipe(Effect.schedule(Schedule.spaced(Duration.seconds(1)))),
          NonEmptyString2k("post publishing")
        )

        return op.id
      })
  })
})
