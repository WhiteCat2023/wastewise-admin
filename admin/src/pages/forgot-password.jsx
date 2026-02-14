import React, { useState } from 'react'
import {
  Box,
  Button,
  IconButton,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Image from 'mui-image'
import loginImage from '../assets/LoginImage.png'
import iconTitle from '../assets/icon_title.png'
import { useAuthService } from '../service/auth/auth.firebase'
import { ArrowBack } from '@mui/icons-material'


const heroImage =
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop'
function ForgotPassword() {

  const [email, setEmail] = useState('')
    const [emailTouched, setEmailTouched] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const auth = useAuthService();

    const isEmailValid = (value) => /\S+@\S+\.\S+/.test(value)
    const handleChange = (e) => {
      setEmail(e.target.value)
    }

    const handleSubmit = async (e) => {
      e?.preventDefault();
      setEmailTouched(true)
      try {
        if (!email || !isEmailValid(email)) {
          return
        }
        setIsSubmitting(true)
        await auth.forgotPassword(email)
        console.log({ email });
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
                    <IconButton onClick={() => window.history.back()}>
                        <ArrowBack sx={{ color: '#4d5f2b' }} />
                    </IconButton>
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
                      label="Email" 
                      onChange={handleChange}
                      onBlur={() => setEmailTouched(true)}
                      name="email"
                      value={email}
                      size="small" 
                      fullWidth
                      error={emailTouched && (!email || !isEmailValid(email))}
                      helperText={emailTouched && !email ? 'Email is required' : emailTouched && !isEmailValid(email) ? 'Enter a valid email address' : ' '}
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
                    disabled={isSubmitting}
                    sx={{
                      bgcolor: '#4d5f2b',
                      borderRadius: 1.5,
                      textTransform: 'none',
                      '&:hover': { bgcolor: '#3f4f24' },
                      '&.Mui-disabled': { bgcolor: '#a5b079', color: '#f5f5f5' },
                    }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword