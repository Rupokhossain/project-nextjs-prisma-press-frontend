"use server"

import { cookies } from "next/headers";

export const getPremiumNews = async () => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  console.log(accessToken);

  if (!accessToken) {
    return {
      success: false,
      message: "User Not logged in!",
    };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/premium`, {
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 6,
      tags: ["premium-posts"],
    },
  });

  const result = await res.json();
  return result;
};
