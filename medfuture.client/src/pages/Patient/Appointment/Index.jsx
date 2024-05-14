import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import List from './List';
import Toolbar from './Toolbar';
import { useState } from 'react';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

function Index() {

    const [dateRange, setDateRange] = useState([dayjs().add(-7, 'd'), dayjs().add(7, 'd')]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [prevDateRange, setPrevDateRange] = useState(null);

  return (
      <Container maxWidth="lg" sx={{ width: { md: '1100px' } }}>
          <Box >

              <Toolbar props={{ dateRange ,setDateRange, setStatusFilter, setPrevDateRange }} />
              <List props={{ dateRange, statusFilter, prevDateRange, setPrevDateRange }} />

          </Box>

      </Container>
  );
}

export default Index;