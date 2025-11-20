"use client";

import Cookies from "js-cookie";

export function getToken() {
  return Cookies.get("token") || null;
}

export function getRole() {
  return Cookies.get("role") || null;
}

export function setAuth(token: string, role: string) {
  Cookies.set("token", token, { expires: 7 });
  Cookies.set("role", role, { expires: 7 });
}

export function logout() {
  Cookies.remove("token");
  Cookies.remove("role");
  window.location.href = "/login";
}
