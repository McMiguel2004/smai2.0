// components/CenterButtons.jsx
import { Box } from '@mui/material';
import { Home, Storage, Person, VpnKey } from '@mui/icons-material';
import NavButton from './NavButton';

const CenterButtons = () => (
  <Box sx={{
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  }}>
    <NavButton to="/" icon={<Home />}>Home</NavButton>
    <NavButton to="/servers" icon={<Storage />}>Servers</NavButton>
    <NavButton to="/skins" icon={<Person />}>Skins</NavButton>
    <NavButton to="/wireguard" icon={<VpnKey />}>WireGuard</NavButton>
  </Box>
);

export default CenterButtons;
