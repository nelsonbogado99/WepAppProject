import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Navigator from './Navigator';
import Content from './Content';
import Typography from '@mui/material/Typography';

let theme = createTheme({
  palette: {
    primary: {
      light: '#63ccff',
      main: '#009be5',
      dark: '#006db3',
    },
  },
});

export default function Paperbase() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Box component="nav">
          <Navigator
            PaperProps={{ style: { width: 256 } }}
            variant={isSmUp ? 'permanent' : 'temporary'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ py: 2, px: 4, bgcolor: '#FCFCFC', color: '#030303', textAlign: 'center' }}>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', letterSpacing: 1.5 }}>
              Photos Google API
            </Typography>
          </Box>
          <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#FCFCFC' }}>
            <Content />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
