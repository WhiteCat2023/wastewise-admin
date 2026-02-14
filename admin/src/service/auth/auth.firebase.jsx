import { createContext, useContext, useMemo, useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../config/firebase'


const AuthService = createContext(null)

function AuthServiceProvider({children}) {

    const [loading, setLoading] = useState(false)

    const login = async (email, password) => {
        setLoading(true)
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } finally {
            setLoading(false)
        }
    }

    const signUp = async (email, password) => {
        setLoading(true)
        try {
            await createUserWithEmailAndPassword(auth, email, password)
        } finally {
            setLoading(false)
        }
    }

    const authContext = useMemo(() => ({
        login,
        signUp,
        loading,
    }), [loading])

    return (
        <AuthService.Provider value={authContext}>
            {children}
        </AuthService.Provider>
    )
}

export default AuthServiceProvider

export function useAuthService() {
    const context = useContext(AuthService)
    if (!context) {
        throw new Error('useAuthService must be used within AuthServiceProvider')
    }
    return context
}