import { BlogPost } from "@effect-app-boilerplate/models/Blog"
import { BlogRsc } from "@effect-app-boilerplate/resources"
import { BogusEvent } from "@effect-app-boilerplate/resources/Events"
import { PositiveInt } from "@effect-app/prelude/schema"
import { NotFoundError } from "api/errors.js"
import { BlogPostRepo, Events, Operations } from "api/services.js"

const blog = matchFor(BlogRsc)

const FindPost = blog.matchFindPost(
  { BlogPostRepo },
  (req, { blogPostRepo }) =>
    blogPostRepo
      .find(req.id)
      .map((_) => _.getOrNull)
)
const GetPosts = blog.matchGetPosts(
  { BlogPostRepo },
  (_, { blogPostRepo }) => blogPostRepo.all.map((items) => ({ items }))
)

const CreatePost = blog.matchCreatePost(
  { BlogPostRepo },
  (req, { blogPostRepo }) =>
    Effect(new BlogPost({ ...req }))
      .tap(blogPostRepo.save)
      .map((_) => _.id)
)

const PublishPost = blog.matchPublishPost(
  { BlogPostRepo, Events, Operations },
  (req, { blogPostRepo, events, operations }) =>
    Do(($) => {
      $(
        blogPostRepo
          .find(req.id)
          .flatMap((_) => _.encaseInEffect(() => new NotFoundError("BlogPost", req.id)))
      )

      const targets = [
        "google",
        "twitter",
        "facebook"
      ]

      const done: string[] = []

      const operationId = $(
        Effect.forkOperationWithEffect(
          (opId) =>
            operations.update(opId, {
              total: PositiveInt(targets.length),
              completed: PositiveInt(done.length)
            })
              > targets
                .forEachEffect((_) =>
                  Effect(done.push(_))
                    .tap(() =>
                      operations.update(opId, {
                        total: PositiveInt(targets.length),
                        completed: PositiveInt(done.length)
                      })
                    )
                    .delay(Duration.seconds(4))
                )
                .map(() => "the answer to the universe is 41"),
          // while operation is running...
          (_opId) =>
            Effect
              .suspend(() => events.publish(new BogusEvent({})))
              .schedule(Schedule.spaced(DUR.seconds(1)))
        )
      )

      return operationId
    })
)

export default blog.controllers({ FindPost, GetPosts, CreatePost, PublishPost })
