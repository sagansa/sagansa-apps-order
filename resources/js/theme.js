import { createTheme } from '@mui/material/styles';
import {
  foodPrimaryBrown,
  foodSecondaryBrown,
  textPrimary,
  textSecondary,
  textLight,
  textDark,
  textMuted,
  textLink,
  textError,
  textSuccess,
  primaryRed,
  primaryGreen,
  primaryYellow
} from './constants/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: foodPrimaryBrown,
    },
    secondary: {
      main: foodSecondaryBrown,
    },
    error: {
      main: primaryRed,
    },
    warning: {
      main: primaryYellow,
    },
    success: {
      main: primaryGreen,
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
      disabled: textMuted,
      hint: textMuted,
    },
    background: {
      default: textLight,
      paper: textLight,
    },
    common: {
      black: textDark,
      white: textLight,
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: textLink,
        },
      },
    },
  },
});

export default theme;
