import { UserRepo } from "#Accounts/UserRepo"
import { handlerFor } from "#api/lib/handler"
import { Effect } from "effect-app"
import { CreatePost } from "./CreatePost.resource.js"
import { BlogPost } from "./models.js"
import { BlogPostRepo } from "./Repo.js"

export default handlerFor(CreatePost)({
  dependencies: [
    BlogPostRepo.Default,
    UserRepo.Default
  ],
  effect: Effect.gen(function*() {
    const blogPostRepo = yield* BlogPostRepo
    const userRepo = yield* UserRepo

    return (req) =>
      userRepo
        .getCurrentUser
        .pipe(
          Effect.andThen((author) => (new BlogPost({ ...req, author }, true))),
          Effect.tap(blogPostRepo.save)
        )
  })
})
