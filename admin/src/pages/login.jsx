import React, { useState } from 'react'
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import Image from 'mui-image'
import { useNavigate } from 'react-router-dom'
import { useAuthService } from '../service/auth/auth.firebase'

import iconTitle from '../assets/icon_title.png'

const heroImage =
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop'
function Login() {

    const [input, setInput] = useState({
      email: '',
      password: ''
    });
    const [emailTouched, setEmailTouched] = useState(false)
    const [passwordTouched, setPasswordTouched] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const isEmailValid = (value) => /\S+@\S+\.\S+/.test(value)
    const isPasswordAlphanumeric = (value) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/.test(value)

    const auth = useAuthService()
    const navigate = useNavigate()

    const handleChange = (e) => {
      setInput(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }))
    }

    const handleSubmit = async (e) => {
      e?.preventDefault();
      setEmailTouched(true)
      setPasswordTouched(true)
      try {
        if (!input.email || !input.password || !isEmailValid(input.email)) {
          return
        }
        if (!isPasswordAlphanumeric(input.password)) {
          throw new Error('Password must be alphanumeric')
        }
        setIsSubmitting(true)
        await auth.login(input.email, input.password)
        navigate('/dashboard')
        console.log(input);
      } catch (error) {
        console.error(error)
      } finally {
        setIsSubmitting(false)
      }
    }

    const passwordErrors = []
    if (passwordTouched) {
      if (!input.password) {
        passwordErrors.push('Password is required')
      }
      if (input.password && !isPasswordAlphanumeric(input.password)) {
        passwordErrors.push('Password must include letters, numbers, and a special character (!@#$%^&*)')
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
                  <Image
                    src={iconTitle}
                    alt="Description of image"
                    width={150}
                    size="contain"
                    showLoading
                    shift="right"
                    duration={2000}
                    sx={{ borderRadius: 2, size: 40 }}
                    />
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, maxWidth: 320 }}
                >
                  Track, report, and streamline waste management in real time.
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField 
                      label="Email" 
                      onChange={handleChange}
                      onBlur={() => setEmailTouched(true)}
                      name="email"
                      value={input.email}
                      size="small" 
                      fullWidth
                      error={emailTouched && (!input.email || !isEmailValid(input.email))}
                      helperText={emailTouched && !input.email ? 'Email is required' : emailTouched && !isEmailValid(input.email) ? 'Enter a valid email address' : ' '}
                      sx={{
                        '& .MuiOutlinedInput-root.Mui-error fieldset': {
                          borderColor: '#d32f2f',
                        },
                      }}
                    />
                  <TextField 
                      label="Password" 
                      onChange={handleChange} 
                      onBlur={() => setPasswordTouched(true)}
                      name="password" 
                      value={input.password}
                      size="small" 
                      type={showPassword ? 'text' : 'password'} 
                      fullWidth
                      error={passwordErrors.length > 0}
                      helperText={passwordErrors.length > 0 ? (
                        <Box component="ul" sx={{ m: 0, pl: 2 }}>
                          {passwordErrors.map((message) => (
                            <Box component="li" key={message}>
                              {message}
                            </Box>
                          ))}
                        </Box>
                      ) : ' '}
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
                      }}
                    />
                  <Box display="flex" justifyContent="flex-end">
                    <Link href="/forgot-password" underline="none" color="#4d5f2b" fontWeight={600}>
                      Forgot Password
                    </Link>
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      bgcolor: '#4d5f2b',
                      borderRadius: 1.5,
                      textTransform: 'none',
                      '&:hover': { bgcolor: '#3f4f24' },
                      '&.Mui-disabled': { bgcolor: '#a5b079', color: '#f5f5f5' },
                    }}
                  >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </Button>
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
          <Image
            src={heroImage}
            alt="Description of image"
            width="100%"
            height="100%"
            size="cover"
            showLoading
   
            duration={2000}
            sx={{ 
                borderRadius: 5, 
                p: 1, 
                 
            }}
          />
        </Box>
      </Paper>
    </Box>
  )
}

export default Login