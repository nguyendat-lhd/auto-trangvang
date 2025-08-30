import { Card, CardContent, Typography } from '@mui/material'

export function Dashboard() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1">Welcome to the admin dashboard.</Typography>
      </CardContent>
    </Card>
  )
}


