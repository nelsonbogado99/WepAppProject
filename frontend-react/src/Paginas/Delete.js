import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Content from './Content';

const theme = createTheme({
  palette: {
    primary: {
      light: '#63ccff',
      main: '#009be5',
      dark: '#006db3',
    },
  },
});

export default function Paperbase() {
  const [dato] = useState('SII');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ py: 2, px: 4, bgcolor: '#FCFCFC', color: '#344955', textAlign: 'center' }}>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'normal', letterSpacing: 0 }}>
              Papelera Google API
            </Typography>
          </Box>
          <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#FCFCFC' }}>
            <Content dato={dato} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}





/*import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Delete() {
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.data) {
      const { data } = location.state;
      // Haz algo con los datos
      console.log(data);
    }
  }, [location]);

  return (
    // JSX del componente Delete
  );
}

export default Delete;
*/