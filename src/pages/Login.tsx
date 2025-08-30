import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: LoginFormValues) => {
    // TODO: integrate auth provider (e.g., Supabase)
    await new Promise((r) => setTimeout(r, 500))
    console.log('login', values)
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper sx={{ p: 3, width: 360 }}>
        <Typography variant="h6" gutterBottom>Đăng nhập</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email')}
            />
            <TextField
              label="Mật khẩu"
              type="password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password')}
            />
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}


