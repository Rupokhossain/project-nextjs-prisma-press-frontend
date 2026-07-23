"use server";

import { cookies } from "next/headers";

export const getPremiumNews = async ({
  query,
}: {
  query?: { [key: string]: string | string[] | undefined };
}) => {

  // bad approach
  // const searchTerm = `${search?.searchTerm ? `?searchTerm=${search.searchTerm}` : ""}`;


  const params = new URLSearchParams()

  if(query && query.searchTerm) {
    params.set("searchTerm", query.searchTerm as string)
  }

  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  console.log(accessToken);

  if (!accessToken) {
    return {
      success: false,
      message: "User Not logged in!",
    };
  }

  const queryString = params.toString() ? `?${params.toString()}` : "";
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/premium${queryString}`,
    {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-store",
      next: {
        revalidate: 60 * 60 * 6,
        tags: ["premium-posts"],
      },
    },
  );

  const result = await res.json();
  return result;
};
