import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import CompBase from "./Paginas/CompBase";
import Ho from "./Paginas/Ho";
import Default from "./Paginas/Default";
import Dashboard from "./Paginas/Dashboard";

const App = () => {
  const location = useLocation();

  const showLoginInterface = location.pathname !== '/photos';

  const renderAppBar = () => (
    <AppBar position="static" style={{ background: '#314850' }}>
      <Toolbar>
        <Typography variant="h6" style={{ flex: 1 }}>
          Google Photos
        </Typography>
        {showLoginInterface && (
          <Button color="inherit" component={Link} to="/dashboard">
            <AccountCircleIcon sx={{ marginRight: 1 }} />
            Iniciar Sesión
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );

  return (
    <div className="app-container">
      {showLoginInterface && renderAppBar()}
      <Routes>
        <Route path="/" element={<Ho />} />
        <Route path="/photos" element={<CompBase />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Default />} />
      </Routes>
    </div>
  );
}

export default App;
