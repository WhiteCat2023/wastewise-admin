import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { confirmPasswordReset, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../config/firebase'


const AuthService = createContext(null)

function AuthServiceProvider({children}) {

    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    const [authReady, setAuthReady] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setAuthReady(true)
        })

        return () => unsubscribe()
    }, [])

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

    const logout = async () => {
        setLoading(true)
        try {
            await signOut(auth)
        } finally {
            setLoading(false)
        }
    }

    const forgotPassword = async (email, redirectUrl) => {
        setLoading(true)
        try {
            const url = redirectUrl || `${window.location.origin}/new-password`
            await sendPasswordResetEmail(auth, email, {
                url,
                handleCodeInApp: true,
            })
        } finally {
            setLoading(false)
        }
    }

    const confirmResetPassword = async (actionCode, newPassword) => {
        setLoading(true)
        try {
            await confirmPasswordReset(auth, actionCode, newPassword)
        } finally {
            setLoading(false)
        }
    }

    const authContext = useMemo(() => ({
        login,
        signUp,
        logout,
        loading,
        user,
        authReady,
        forgotPassword,
        confirmResetPassword,
    }), [loading, user, authReady])

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