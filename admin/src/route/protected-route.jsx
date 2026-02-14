import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthService } from '../service/auth/auth.firebase'

export default function ProtectedRoute({ children }) {
  const { user, authReady } = useAuthService()

  if (!authReady) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}