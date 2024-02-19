import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Content from './Content';
import { styles } from '../Estilos/CompBase';

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
  const [dato] = useState('SIIII');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={styles.container}>
        <Box sx={styles.contentBox}>
          <Box sx={styles.headerBox}>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'normal', letterSpacing: 0 }}>
              Photos Google API
            </Typography>
          </Box>
          <Box component="main" sx={styles.mainBox}>
            <Content dato={dato} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
