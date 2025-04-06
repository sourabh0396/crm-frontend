import { Box } from '@mui/material';
import ConnectedCallsTable from './ConnectedCallsTable';

const DashboardPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <ConnectedCallsTable />
    </Box>
  );
};

export default DashboardPage; 