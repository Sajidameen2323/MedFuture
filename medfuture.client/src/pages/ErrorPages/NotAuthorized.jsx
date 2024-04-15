import {  Result } from 'antd';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';

function NotAuthorized() {
  return (
      <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={<Button component={RouterLink} to="/" type="primary">Back Home</Button>}
      />
  );
}

export default NotAuthorized;