"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const subscribePremium = async () => {
    const cookieStore = await cookies();
        
            const accessToken = cookieStore.get("accessToken")?.value || null;
        
            if(!accessToken){        
                return {
                    success : false,
                    message : "User not logged in!"
                }
            }
    
        const res = await fetch(`${process.env.BACKEND_API_URL}/api/subscription/checkout`, {
            method: "POST",
            headers: {
                Cookie: `accessToken=${accessToken}`
            }
        });
    
        const result = await res.json();
    
        if(result.success && result.data.paymentUrl.transactionResult) {
            redirect(result.data.paymentUrl.transactionResult);
        }

        return result;
        
}