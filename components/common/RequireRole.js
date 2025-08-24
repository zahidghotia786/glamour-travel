"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RequireRole({ allow = [], children, redirect = "/" }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role"); // role stored as string

    if (role && allow.map(r => r.toLowerCase()).includes(role.toLowerCase())) {
      setOk(true);
    } else {
      router.replace(redirect);
    }
  }, [allow, router, redirect]);

  if (!ok) return null;
  return children;
}
