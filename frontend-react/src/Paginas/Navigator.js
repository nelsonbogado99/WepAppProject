import * as React from 'react';
import styled from '@mui/system/styled';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Inbox from '@mui/icons-material/Inbox';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import Send from '@mui/icons-material/Send';
import Delete from '@mui/icons-material/Delete';
import Info from '@mui/icons-material/Info';
import Drafts from '@mui/icons-material/Drafts';
import SettingsIcon from '@mui/icons-material/Settings';
import Folder from '@mui/icons-material/Folder';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

// Constantes para estilos repetidos
const circularIconButtonStyles = {
  borderRadius: '50%',
  backgroundColor: '#F9AA33',
  '&:hover': {
    backgroundColor: '#F9AA33',
  },
  width: '40px',
  height: '40px',
  '@media only screen and (max-width: 600px)': {
    width: '32px',
    height: '32px',
  },
};

const homeIconButtonStyles = {
  ...circularIconButtonStyles,
  marginLeft: '-8px',
};

const itemStyles = {
  py: '2px',
  px: 3,
  color: '#fff',
  '&:hover, &:focus': {
    bgcolor: 'rgba(255, 255, 255, 0.08)',
  },
};

const itemCategoryStyles = {
  boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
  py: 1.5,
  px: 3,
};

const StyledAppBar = styled(AppBar)({
  top: 'auto',
  bottom: 0,
  background: '#344955',
  boxShadow: 'none',
  borderTop: '1px solid #FCFCFC',
  position: 'fixed',
  width: '100%',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-40%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '5%',
    height: '100%',
    background: '#FCFCFC',
    borderRadius: '50%',
  },
});

const CenteredBox = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: '0 16px',
  '@media only screen and (max-width: 600px)': {
    padding: '0 8px',
  },
});

const CircularIconButton = styled(IconButton)(circularIconButtonStyles);

const HomeIconButton = styled(CircularIconButton)(homeIconButtonStyles);

const categories = [
  {
    children: [
      { id: 'Bandeja de entrada', icon: <Inbox /> },
      { id: 'Base de datos', icon: <DnsRoundedIcon /> },
      { id: 'Enviado', icon: <Send /> },
      { id: 'Basura', icon: <Delete /> },
      { id: 'Spam', icon: <Info /> },
      { id: 'Borrador', icon: <Drafts /> },
    ],
  },
  {
    id: 'Carpetas',
    children: [
      { id: 'Ingreso', icon: <Folder /> },
      { id: 'Vacaciones', icon: <Folder /> },
      { id: 'Impuesto', icon: <Folder /> },
    ],
  },
];

export default function BottomAppBarWithNavigation() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <StyledAppBar>
        <Toolbar>
          <CenteredBox>
            <IconButton size="large" edge="start" color="#344955 " aria-label="open drawer" onClick={handleMenuToggle}>
              <MenuIcon />
            </IconButton>
            <HomeIconButton size="large" color="#fff" aria-label="edit"  style={{ marginLeft: '0px', marginTop: '-50px' }}>
              <EditIcon />
            </HomeIconButton>
            <IconButton size="large" edge="end" color="#fff" aria-label="account">
              <AccountCircleIcon />
            </IconButton>
          </CenteredBox>
        </Toolbar>
      </StyledAppBar>

      <Drawer variant="temporary" open={isMenuOpen} onClose={handleMenuToggle}>
        <List disablePadding sx={{ bgcolor: ' #344955 ', height: '100%' }}>
          <ListItem key="user-info" sx={{ ...itemStyles, ...itemCategoryStyles, fontSize: 22, color: '#fff', justifyContent: 'flex-end' }}>
            <ListItemIcon>
              <Avatar alt="Nelson" src="https://example.com/images/gmail.svg" />
            </ListItemIcon>
            <ListItemIcon>
              <IconButton color="inherit">
                <SettingsIcon />
              </IconButton>
            </ListItemIcon>
          </ListItem>
          <ListItem key="compose" sx={{ ...itemStyles, ...itemCategoryStyles }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: '25px',
                color: '#344955 ',
                bgcolor: '#FFA500',
                typography: {
                  fontFamily: 'Libre Franklin',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  letterSpacing: '0.15px',
                },
              }}
            >
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              COMPOSE
            </Button>
          </ListItem>
          {categories.map(({ id, children }) => (
            <Box key={id} sx={{ bgcolor: ' #344955 ' }}>
              <ListItem key={id} sx={{ py: 2, px: 3 }}>
                <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
              </ListItem>
              {children.map(({ id: childId, icon, active }) => (
                <ListItem key={childId} disablePadding>
                  <ListItemButton selected={active} sx={itemStyles}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText>{childId}</ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </List>
      </Drawer>

      <div style={{ marginLeft: isMenuOpen ? '240px' : '0', padding: '16px', marginTop: '64px', transition: 'margin-left 0.3s ease-in-out' }}>

      </div>
    </div>
  );
}
