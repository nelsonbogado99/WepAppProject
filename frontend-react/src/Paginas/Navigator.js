import React, { useState, useEffect } from 'react';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import Delete from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { useNavigate } from 'react-router-dom';
import { itemStyles, itemCategoryStyles, StyledAppBar, CenteredBox } from '../Estilos/Navigator';

export default function BottomAppBarWithNavigation({ miFuncionEnPaperbase, data }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  let correo_electronico, nombre, foto_perfil_url;
  if (data && data.length > 0) {
    ({ correo_electronico, nombre, foto_perfil_url } = data[0]);
  }

  const handleBDClick = () => {
    console.log('Clic en Bandeja de entrada');
    navigate('/data-base', { state: { data } });
  };

  const handleBasuraClick = () => {
    console.log('Clic en Basura');
    navigate('/delete', { state: { data } });
  };

  useEffect(() => {
    // Aquí puedes agregar lógica si es necesario
  }, [miFuncionEnPaperbase]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const categories = [
    {
      children: [
        { id: 'Base de datos', icon: <DnsRoundedIcon />, onClick: handleBDClick },
        { id: 'Papelera', icon: <Delete />, onClick: handleBasuraClick },
      ],
    },
  ];

  console.log('Correo electrónico:', correo_electronico);
  console.log('Nombre:', nombre);
  console.log('URL de foto de perfil:', foto_perfil_url);

  return (
    <div>
      <StyledAppBar>
        <Toolbar>
          <CenteredBox>
            <IconButton size="large" edge="start" aria-label="open drawer" onClick={handleMenuToggle}>
              <MenuIcon />
            </IconButton>
          </CenteredBox>
        </Toolbar>
      </StyledAppBar>

      <Drawer variant="temporary" open={isMenuOpen} onClose={handleMenuToggle}>
        <List disablePadding sx={{ bgcolor: '#344955', height: '100%' }}>
          <ListItem key="user-info" sx={{ ...itemStyles, ...itemCategoryStyles, fontSize: 22, color: '#fff', justifyContent: 'flex-end' }}>
            <ListItem key="user-info">
              <ListItemIcon></ListItemIcon>
            </ListItem>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle sx={{ backgroundColor: '#333', color: '#FFF' }}>{nombre}</DialogTitle>
              <DialogContent>
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                  <Avatar src={foto_perfil_url} />
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Correo Electrónico"
                        secondary={correo_electronico}
                        primaryTypographyProps={{ variant: 'subtitle1', fontWeight: 'bold', color: '#333' }}
                      />
                    </ListItem>
                  </List>
                </Box>
              </DialogContent>
            </Dialog>

            <Avatar alt={nombre} src={foto_perfil_url} onClick={handleProfileClick} />
          </ListItem>
          <ListItem key="compose" sx={{ ...itemStyles, ...itemCategoryStyles }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: '25px',
                color: '#344955',
                bgcolor: '#FFA500',
                typography: {
                  fontFamily: 'Libre Franklin',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  letterSpacing: '0.15px',
                },
              }}
              onClick={() => window.location.href = '/subir'}
            >
              Agregar
            </Button>
          </ListItem>

          {categories.map(({ id, children }) => (
            <Box key={id} sx={{ bgcolor: '#344955' }}>
              <ListItem key={id} sx={{ py: 2, px: 3 }}>
                <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
              </ListItem>
              {children.map(({ id: childId, icon, active, onClick }) => (
                <ListItem key={childId} disablePadding>
                  <ListItemButton selected={active} sx={itemStyles} onClick={onClick}>
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
