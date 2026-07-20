import { Navbar } from '@/components/shared/navbar'
import { getMe } from '@/service/getMe'
import React from 'react'

const AuthGroupLayout = async(
    {
        children
    } : {
        children: React.ReactNode
    }
) => {

    const user = await getMe();

  return ( 
    <>
        <Navbar user={user}></Navbar>

        {children}
    </>
  )
}

export default AuthGroupLayout