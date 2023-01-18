import { prefixedStringId } from "@effect-app/prelude/schema"

export const BlogPostId = prefixedStringId<BlogPostId>()("post", "BlogPostId")
export interface BlogPostIdBrand {
  readonly BlogPostId: unique symbol
}
export type BlogPostId = StringId & BlogPostIdBrand & `post-${string}`

@useClassFeaturesForSchema
export class BlogPost extends MNModel<BlogPost, BlogPost.ConstructorInput, BlogPost.Encoded, BlogPost.Props>()({
  id: BlogPostId.withDefault,
  title: ReasonableString,
  body: LongString,
  createdAt: date.withDefault
}) {}

// codegen:start {preset: model}
//
/* eslint-disable */
export namespace BlogPost {
  /**
   * @tsplus type BlogPost.Encoded
   * @tsplus companion BlogPost.Encoded/Ops
   */
  export class Encoded extends EncodedClass<typeof BlogPost>() {}
  export interface ConstructorInput
    extends ConstructorInputFromApi<typeof BlogPost> {}
  export interface Props extends GetProvidedProps<typeof BlogPost> {}
}
/* eslint-enable */
//
// codegen:end
