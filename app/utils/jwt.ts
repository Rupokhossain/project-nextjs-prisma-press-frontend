/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";


const verifiedToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken,
    };
  } catch (error: any) {
    console.log("Token verification faild:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const jwtUtils = {
  verifiedToken,
};
