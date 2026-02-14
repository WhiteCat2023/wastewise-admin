import React, { useState } from 'react'
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material'
import Image from 'mui-image'
import { useSearchParams } from 'react-router-dom'
import loginImage from '../assets/LoginImage.png'
import iconTitle from '../assets/icon_title.png'
import { useAuthService } from '../service/auth/auth.firebase'

const heroImage =
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop'
function NewPassword() {

  const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordTouched, setPasswordTouched] = useState(false)
    const [confirmTouched, setConfirmTouched] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [sent, setSent] = useState(false)
    const [formError, setFormError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const auth = useAuthService();
    const [searchParams] = useSearchParams()
    const actionCode = searchParams.get('oobCode')

    const handleChange = (e) => {
      const { name, value } = e.target
      if (name === 'password') {
        setPassword(value)
      }
      if (name === 'confirmPassword') {
        setConfirmPassword(value)
      }
    }

    const handleSubmit = async (e) => {
      e?.preventDefault();
      setPasswordTouched(true)
      setConfirmTouched(true)
      setFormError('')
      try {
        if (!password || !confirmPassword || password !== confirmPassword) {
          return
        }
        if (!actionCode) {
          setFormError('Invalid or expired reset link.')
          return
        }
        setIsSubmitting(true)
        await auth.confirmResetPassword(actionCode, password)
        setSent(true)
        console.log({ password, confirmPassword });
      } catch (error) {
        console.error(error)
      } finally {
        setIsSubmitting(false)
      }
    }

  return (
    <Box
      sx={{
        // minHeight: '100vh',
        height: '100dvh',
        bgcolor: '#f3f7cf',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // p: { xs: 2, md: 4 },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          height: '100%',
        //   maxWidth: 980,
        //   borderRadius: 4,
          overflow: 'hidden',
          bgcolor: '#f7fbd8' 
        }}
      >
        <Box
          sx={{
            display: 'grid',
            height: '100%',
            gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' },
          }}
        >
          <Box sx={{ 
            p: { xs: 4, md: 15 }, 
            bgcolor: '#f7fbd8' 
            }}>
            <Stack spacing={3}>
              <Box>
                <Stack direction="row" spacing={1.5} alignItems="center">
         
                  {/* <Typography variant="h6" color="#4d5f2b" fontWeight={700}>
                    WasteWise
                  </Typography> */}
                  {/* <Image
                    src={iconTitle}
                    alt="Description of image"
                    width={150}
                    size="contain"
                    showLoading
                    shift="right"
                    duration={2000}
                    sx={{ borderRadius: 2, size: 40 }}
                    /> */}
                    {/* <IconButton onClick={() => window.history.back()} >
                        <ArrowBack sx={{ color: '#4d5f2b' }} />
                    </IconButton> */}
                </Stack>
                <Typography
                  variant="h5"
                  color="#4d5f2b"
                  fontWeight={700}
                  sx={{ mt: 1 }}
                >
                  Forgot Password
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 360 }}>
                  Enter your email and we&apos;ll send you reset instructions.
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField 
                      label="New Password" 
                      onChange={handleChange}
                      onBlur={() => setPasswordTouched(true)}
                      name="password"
                      value={password}
                      size="small" 
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      error={passwordTouched && !password}
                      helperText={passwordTouched && !password ? 'New password is required' : ' '}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                              onClick={() => setShowPassword((prev) => !prev)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root.Mui-error fieldset': {
                          borderColor: '#d32f2f',
                        },
                        '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                          borderColor: '#4d5f2b',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#4d5f2b',
                        },
                        '& .MuiOutlinedInput-root.Mui-focused legend': {
                          color: '#4d5f2b',
                        },
                      }}
                    />
                  <TextField 
                      label="Confirm New Password" 
                      onChange={handleChange}
                      onBlur={() => setConfirmTouched(true)}
                      name="confirmPassword"
                      value={confirmPassword}
                      size="small" 
                      type={showConfirm ? 'text' : 'password'}
                      fullWidth
                      error={confirmTouched && (!confirmPassword || confirmPassword !== password)}
                      helperText={confirmTouched && !confirmPassword ? 'Confirm your new password' : confirmTouched && confirmPassword !== password ? 'Passwords do not match' : ' '}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={showConfirm ? 'Hide password' : 'Show password'}
                              onClick={() => setShowConfirm((prev) => !prev)}
                              edge="end"
                            >
                              {showConfirm ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root.Mui-error fieldset': {
                          borderColor: '#d32f2f',
                        },
                        '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                          borderColor: '#4d5f2b',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#4d5f2b',
                        },
                        '& .MuiOutlinedInput-root.Mui-focused legend': {
                          color: '#4d5f2b',
                        },
                      }}
                    />
                  {/* <Box display="flex" justifyContent="flex-end">
                    <Link href="/forgot-password" underline="none" color="#4d5f2b" fontWeight={600}>
                      Forgot Password
                    </Link>
                  </Box> */}
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || sent}
                    sx={{
                      bgcolor: '#4d5f2b',
                      borderRadius: 1.5,
                      textTransform: 'none',
                      '&:hover': { bgcolor: '#3f4f24' },
                      '&.Mui-disabled': { bgcolor: '#a5b079', color: '#f5f5f5' },
                    }}
                  >
                    {isSubmitting ? 'Saving...' : sent ? 'Password Updated' : 'Update Password'}
                  </Button>
                  {sent && (
                    <Typography variant="body2" color="text.secondary">
                      Your password has been updated.
                    </Typography>
                  )}
                  {formError && (
                    <Typography variant="body2" color="error">
                      {formError}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Box>

          {/* <Box
            sx={{
              minHeight: { xs: 240, md: 520 },
              backgroundImage: `url(${heroImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          /> */}
          <Box sx={{
            width: '100%',
            height: '100%',
            overflow: 'hidden'
          }}>
            <Image
                src={loginImage}
                // src={heroImage}
                alt="Description of image"
                width="100%"
                height="100%"
                size="contain"
                showLoading
                
                duration={2000}
                sx={{ 
                    borderRadius: 5, 
                    p: 1, 
                    overflow: 'hidden',
                }}
            />
          </Box>
          
        </Box>
      </Paper>
    </Box>
  )
}

export default NewPassword