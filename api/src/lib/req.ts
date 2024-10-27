import { NotLoggedInError, UnauthorizedError } from "@effect-app/infra/errors"
import type { Role } from "api/User/User.js"
import type { RPCContextMap } from "effect-app/client"
import { makeRpcClient } from "effect-app/client"
import { makeClientFor } from "effect-app/client/clientFor"
import { RequestCacheLayers } from "./routing.js"

type CTXMap = {
  // we put `never`, because we can't access this service here in the client, and we also don't need to
  // TODO: a base map for client, that the server extends
  allowAnonymous: RPCContextMap.Inverted<"userProfile", never, typeof NotLoggedInError>
  // TODO: not boolean but `string[]`
  requireRoles: RPCContextMap.Custom<"", void, typeof UnauthorizedError, Array<string>>
}

export type RequestConfig = {
  /** Disable authentication requirement */
  allowAnonymous?: true
  /** Control the roles that are required to access the resource */
  allowRoles?: readonly Role[]
}

export const { TaggedRequest: Req } = makeRpcClient<RequestConfig, CTXMap>({
  allowAnonymous: NotLoggedInError,
  requireRoles: UnauthorizedError
})

export const clientFor = makeClientFor(RequestCacheLayers)
