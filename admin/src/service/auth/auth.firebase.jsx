import { useContext, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../config/firebase'


const AuthService = useContext()

function AuthServiceProvider({children}) {

    const [loading, isLoading] = useState(false)

    const login = async (email, password) => {
        isLoading(true)
        await signInWithEmailAndPassword(auth, email, password)
        isLoading(false)
    }

    const signUp = async (email, password) => {
        isLoading(true)
        await createUserWithEmailAndPassword(auth, email, password)
        isLoading(false)
    }

    const authContext = {
        login,
        signUp,
        loading,
    }

    return (
        <AuthService.Provider value={authContext}>
            {children}
        </AuthService.Provider>
    )
}

export default AuthServiceProvider