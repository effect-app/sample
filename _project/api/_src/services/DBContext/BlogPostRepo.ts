import { BlogPost, BlogPostId } from "@effect-app-boilerplate/models/Blog"
import { RepositoryDefaultImpl } from "@effect-app/infra/services/RepositoryBase"

export interface BlogPostPersistenceModel extends BlogPost.Encoded {
  _etag: string | undefined
}

export type BlogPostSeed = "sample" | ""

/**
 * @tsplus type BlogPostRepo
 * @tsplus companion BlogPostRepo.Ops
 */
export class BlogPostRepo extends RepositoryDefaultImpl<BlogPostRepo>()<BlogPostPersistenceModel>()(
  "BlogPost",
  BlogPost,
  (pm) => pm,
  (e, _etag) => ({ ...e, _etag })
) {}

/**
 * @tsplus static BlogPostRepo.Ops Live
 */
export function LiveBlogPostRepo(seed: BlogPostSeed) {
  const makeInitial = Effect.sync(() => {
    const items = seed === "sample"
      ? [
        new BlogPost({
          id: BlogPostId("post-test123"),
          title: ReasonableString("Test post"),
          body: LongString("imma test body")
        })
      ] as const
      : []
    return items
  })
  return BlogPostRepo
    .toLayer((_: Iterable<never>) => Effect.unit, makeInitial)
}
