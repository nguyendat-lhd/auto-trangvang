import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useAuth } from '../auth/AuthProvider'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'

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
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as any)?.from?.pathname || '/dashboard'

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password)
      navigate(redirectTo, { replace: true })
    } catch (err: any) {
      // simple surface error using setError on password field
      const message = err?.message || 'Đăng nhập thất bại'
      // eslint-disable-next-line no-console
      console.error(err)
      // react-hook-form setError via formState not directly here, so set helper via pattern:
      // For simplicity, use alert; can be replaced with toast/snackbar later
      alert(message)
    }
  }

  return (
    <div className="min-h-[100vh] grid place-items-center px-4">
      {user && <Navigate to={redirectTo} replace />}
      <div className="flex flex-col items-center gap-6 w-full max-w-[400px]">
        <div className="flex flex-col items-center gap-2">
          <img src="/trangvang-ai-logo.png" alt="trangvang.ai" className="h-12 w-auto" />
          <div className="text-2xl font-semibold tracking-tight">trangvang.ai</div>
          <div className="text-sm text-muted-foreground">Đăng nhập hệ thống nội bộ</div>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Đăng nhập</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm">Email</label>
                <Input
                  type="email"
                  aria-invalid={!!errors.email || undefined}
                  {...register('email')}
                />
                {errors.email?.message && (
                  <div className="text-destructive text-xs">{errors.email.message}</div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm">Mật khẩu</label>
                <Input
                  type="password"
                  aria-invalid={!!errors.password || undefined}
                  {...register('password')}
                />
                {errors.password?.message && (
                  <div className="text-destructive text-xs">{errors.password.message}</div>
                )}
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


