"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface UserPayload {
  userId: number;
  role: string;
}

export function useUser() {
  const [user, setUser] = useState<UserPayload | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<UserPayload>(token);
      setUser(decoded);
    } catch (err) {
      console.log("Token inválido", err);
      setUser(null);
    }
  }, []);

  return { user };
}
