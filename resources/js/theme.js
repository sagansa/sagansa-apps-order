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
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // Default border color
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: textMuted, // Default border color
            borderWidth: '1px', // Keep default border width
          },
          // Hover state
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: textMuted, // Keep default on hover
          },
          // Focused state
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: textMuted, // Keep default on focus
            // Prevent the notch from appearing
            '& legend': {
              maxWidth: '0.01px', // Effectively hide the legend to prevent notch
            },
          },
          // Text color on focus
          '&.Mui-focused .MuiOutlinedInput-input': {
            color: textPrimary, // Keep primary text color on focus
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          // Focused label color
          '&.Mui-focused': {
            color: textPrimary, // Keep primary text color on focus
          },
        },
        // Adjust label position for outlined variant when focused
        outlined: {
          '&.Mui-focused': {
            transform: 'translate(14px, -9px) scale(0.75)', // Keep the label scaled and moved up
          },
        },
      },
    },
  },
});

export default theme;
