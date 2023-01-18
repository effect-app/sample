import { BlogPost } from "@effect-app-boilerplate/models/Blog"
import { BlogRsc } from "@effect-app-boilerplate/resources"

const items: BlogPost[] = []

const blog = matchFor(BlogRsc)

const GetPosts = blog.matchGetPosts({}, () => Effect({ items }))

const CreatePost = blog.matchCreatePost({}, (req) =>
  Effect(new BlogPost({ ...req }))
    .tap((post) => Effect(items.push(post)))
    .map((_) => _.id))

export default blog.controllers({ GetPosts, CreatePost })
