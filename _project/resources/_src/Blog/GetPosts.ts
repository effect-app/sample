import { BlogPost } from "@effect-app-boilerplate/models/Blog"

export class GetPostsRequest extends Get("/blog/posts")<GetPostsRequest>()(
  {}
) {}

export class GetPostsResponse extends Model<GetPostsResponse>()({
  items: array(BlogPost)
}) {}
