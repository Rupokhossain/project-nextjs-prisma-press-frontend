import { cookies } from "next/headers";

export const getMe = async () => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  console.log(accessToken)

  if (!accessToken) {
    // throw new Error("User Not Logged In!");

    return {
        success: false,
        message: "User Not logged in!"
    }
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/me`, {
    headers: {
      // 3 way
      // Authorization: accessToken as unknown as string
      //  Authorization: `${accessToken}`
      // Authorization: `Bearer ${accessToken}`

      Cookie: `accessToken=${accessToken}`,
    },
  });

  const result = res.json();

  console.log(result);

  return result;
};
