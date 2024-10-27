// codegen:start {preset: barrel, include: ./**/*.controllers.ts, import: default}
import blogBlogControllers from "./Blog/Blog.controllers.js"
import helloWorldHelloWorldControllers from "./HelloWorld/HelloWorld.controllers.js"
import operationsOperationsControllers from "./Operations/Operations.controllers.js"
import userMeControllers from "./User/Me.controllers.js"
import userUsersControllers from "./User/Users.controllers.js"

export {
  blogBlogControllers,
  helloWorldHelloWorldControllers,
  operationsOperationsControllers,
  userMeControllers,
  userUsersControllers
}
// codegen:end
