// BottomAppBarStyles.js
// BottomAppBarStyles.js
import styled from '@mui/system/styled';
import AppBar from '@mui/material/AppBar';
import { IconButton } from '@mui/material';

export const circularIconButtonStyles = {
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

export const homeIconButtonStyles = {
  ...circularIconButtonStyles,
  marginLeft: '-8px',
};

export const itemStyles = {
  py: '2px',
  px: 3,
  color: '#fff',
  '&:hover, &:focus': {
    bgcolor: 'rgba(255, 255, 255, 0.08)',
  },
};

export const itemCategoryStyles = {
  boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
  py: 1.5,
  px: 3,
};

export const StyledAppBar = styled(AppBar)({
  top: 'auto',
  bottom: 0,
  background: '#344955',
  boxShadow: 'none',
  borderTop: '1px solid #FCFCFC',
  position: 'fixed',
  width: '100%',
});


export const CenteredBox = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: '0 16px',
  '@media only screen and (max-width: 600px)': {
    padding: '0 8px',
  },
});

export const CircularIconButton = styled(IconButton)(circularIconButtonStyles);

export const HomeIconButton = styled(CircularIconButton)(homeIconButtonStyles);
