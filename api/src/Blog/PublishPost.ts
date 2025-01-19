import { handlerFor } from "#api/lib/handler"
import { OperationsDefault } from "#api/lib/layers"
import { Events, Operations } from "#api/services"
import { BogusEvent } from "#resources/Events"
import { Duration, Effect, Schedule } from "effect-app"
import { NonEmptyString2k, NonNegativeInt } from "effect-app/Schema"
import { PublishPost } from "./PublishPost.request.js"
import { BlogPostRepo } from "./Repo.js"

export default handlerFor(PublishPost)({
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
