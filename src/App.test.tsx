import { render, screen } from '@testing-library/react'
import type React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { appTheme } from './theme'

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <BrowserRouter>{ui}</BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  )
}

describe('App', () => {
  it('renders dashboard title', () => {
    renderWithProviders(<App />)
    expect(screen.getByText(/Admin Portal/i)).toBeInTheDocument()
  })
})


