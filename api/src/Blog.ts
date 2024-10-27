import { OperationsDefault } from "api/lib/layers.js"
import { matchFor } from "api/lib/routing.js"
import { Events, Operations } from "api/services.js"
import { UserRepo } from "api/Users/UserRepo.js"
import { Duration, Effect, Schedule } from "effect"
import { Option } from "effect-app"
import { NonEmptyString2k, NonNegativeInt } from "effect-app/Schema"
import { blogApi } from "resources.js"
import { BlogPostRepo } from "./Blog/BlogPostRepo.js"
import { BlogPost } from "./Domain/Blog.js"
import { BogusEvent } from "./Domain/Events.js"

export default matchFor(blogApi)([
  BlogPostRepo.Default,
  UserRepo.Default,
  OperationsDefault,
  Events.Default
], ({ CreatePost, FindPost, GetPosts, PublishPost }) =>
  Effect.gen(function*() {
    const blogPostRepo = yield* BlogPostRepo
    const userRepo = yield* UserRepo
    const events = yield* Events
    const operations = yield* Operations

    return {
      FindPost: FindPost((req) =>
        blogPostRepo
          .find(req.id)
          .pipe(Effect.andThen(Option.getOrNull))
      ),

      GetPosts: GetPosts(
        blogPostRepo
          .all
          .pipe(Effect.andThen((items) => ({ items })))
      ),

      CreatePost: CreatePost((req) =>
        userRepo
          .getCurrentUser
          .pipe(
            Effect.andThen((author) => (new BlogPost({ ...req, author }, true))),
            Effect.tap(blogPostRepo.save)
          )
      ),

      PublishPost: PublishPost((req) =>
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
      )
    }
  }))
