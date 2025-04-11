// components/AccountIcon.jsx
import { Box, IconButton, Typography } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const AccountIcon = ({ username, isAuthenticated, onClick }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', gap: 2 }}>
    {isAuthenticated && (
      <Typography variant="body1" sx={{ color: 'white' }}>
        Hola, {username}
      </Typography>
    )}
    <IconButton
      onClick={onClick}
      sx={{
        color: 'white',
        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
      }}
    >
      <AccountCircle fontSize="large" />
    </IconButton>
  </Box>
);

export default AccountIcon;
