<script setup lang="ts">
import { BlogRsc, GraphRsc } from "@effect-app-boilerplate/resources"

const blogClient = clientFor(BlogRsc)
const graphClient = clientFor(GraphRsc)

const [, mutate] = useMutation(graphClient.mutation)
const [, latestPosts, reloadPosts, { mutate: mutatePosts }] = useSafeQuery(
  blogClient.getPosts
)

const createPost = (input: BlogRsc.CreatePost.CreatePostRequest) =>
  pipe(mutate({ CreatePost: { input, query: { result: true } } }), _ =>
    _.then(_ => {
      const r = _["|>"](Either.flatMap(_ => _.body.CreatePost!))["|>"](
        Either.map(_ => _.query!.result!)
      )
      if (r._tag === "Right") {
        const items = latestPosts.value!.items
        mutatePosts(() => Promise.resolve({ items: [...items, r.right] }))
      }
    })
  )
</script>

<template>
  <div>
    <div>
      a new Title and a new body
      <v-btn
        @click="
          createPost({
            title: MO.ReasonableString('empty'),
            body: MO.LongString('A body'),
          })
        "
      >
        Create new post
        </v-btn>
    </div>
    Here's a Post List
    <ul v-if="latestPosts">
      <li v-for="post in latestPosts.items" :key="post.id">
        <nuxt-link :to="{ name: 'blog-id', params: { id: post.id } }">{{
          post.title
        }}</nuxt-link>
      </li>
    </ul>
  </div>
</template>