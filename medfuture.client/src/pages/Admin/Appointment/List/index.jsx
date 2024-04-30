
import DataTable from './table';
import Toolbar from './Toolbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useState } from 'react';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

function Index() {
    const [dateRange, setDateRange] = useState([dayjs(), dayjs().add(7, 'd')]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [prevDateRange, setPrevDateRange] = useState(null);

  return (
      <Container maxWidth="lg" sx={{ width: { md: '1100px' } }}>
    
          <Box >            
              <Toolbar props={{ setDateRange, setStatusFilter, setPrevDateRange }} />
              <DataTable props={{ dateRange, statusFilter, prevDateRange, setPrevDateRange }} />
          </Box>    
      </Container>

  );
}

export default Index;