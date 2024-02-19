// styles.js
import { createTheme, ThemeProvider } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#344955',
    },
  },
  typography: {
    fontFamily: 'Roboto',
    fontWeightMedium: 500,
    fontSize: 14,
    letterSpacing: '1.25px',
  },
});

export const MyThemeProvider = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export const uploadPhotoStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundImage: 'url("../Fondo_Cargar.jpeg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};
