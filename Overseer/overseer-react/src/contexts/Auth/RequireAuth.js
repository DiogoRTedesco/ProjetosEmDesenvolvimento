import React, { useContext } from "react"

import Home from "../../pages/Home"
import { Login } from "../../pages/Login"
import { NotFound } from "../../pages/NotFound"
import { AuthContext } from "./AuthContext"

export const  RequireAuth =  ({ children, level }) => {
    const auth = useContext(AuthContext)
   

    if (!auth.user) {
        return <Login />
    }

    if (auth.user.level < level) {
        return <NotFound />
    }

    return children
}
export const LoginAuth = ({ children }) => {
    const auth = useContext(AuthContext)

    if (auth.user) {
        return <Home />
    } else {
        return children

    }
}