// material-ui
import { Box, Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import { getMenuItems } from 'menu-items/index';
import { useContext } from 'react';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {

    const { currentUser } =  useContext(FirebaseAuthContext)

    const navGroups = getMenuItems(currentUser?.role).items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

export default Navigation;
