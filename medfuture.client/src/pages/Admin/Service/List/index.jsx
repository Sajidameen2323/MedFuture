import { Grid, Container } from '@mui/material';
import CollapsibleTable from './table';

function index() {
  return (
      <Container sx={{ width: { md: '100%' } }}>
          <Grid container sx={{ width: { md: '100%' } }} spacing={4} rowSpacing={6}>

              <Grid item xs={12}>

                  <CollapsibleTable />
                
              </Grid>

          </Grid>
      </Container>
  );
}

export default index;