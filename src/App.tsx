import { Outlet, Route, Routes, Navigate, Link } from 'react-router-dom'
import { AppBar, Box, Container, Toolbar, Typography, Button } from '@mui/material'
import './App.css'
import { Dashboard } from './pages/Dashboard.tsx'
import { Login } from './pages/Login.tsx'

function LayoutShell() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Portal
          </Typography>
          <Button color="inherit" component={Link} to="/login">Login</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3, flexGrow: 1 }}>
        <Outlet />
      </Container>
    </Box>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<LayoutShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}
