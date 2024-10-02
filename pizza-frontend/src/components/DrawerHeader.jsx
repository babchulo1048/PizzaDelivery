import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // Keep the height consistent with the AppBar or any header
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default DrawerHeader;
