// Naive login, good enough for the start

import type { UserId } from "#Domain/User"

export function getUserId() {
  return useCookie("user-id")
}

export function login(userId: UserId) {
  return $fetch(`/login/${userId}`, { credentials: "include" })
}
