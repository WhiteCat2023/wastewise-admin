import React from 'react'
import { useAuthService } from '../service/auth/auth.firebase'
import { Navigate } from 'react-router-dom'

export default function PublicRoute({ children }) {
  const { user, authReady } = useAuthService()

  if (!authReady) {
    return null
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}