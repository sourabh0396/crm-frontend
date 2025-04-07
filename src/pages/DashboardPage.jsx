import { Box, Typography, Container } from '@mui/material';
import ConnectedCallsTable from './ConnectedCallsTable';

const DashboardPage = () => {
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          p: 4,
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#1976d2',
            fontWeight: 600,
            mb: 4,
            pb: 2,
            borderBottom: '2px solid #1976d2',
          }}
        >
          Dashboard
        </Typography>
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            p: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <ConnectedCallsTable />
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage; 