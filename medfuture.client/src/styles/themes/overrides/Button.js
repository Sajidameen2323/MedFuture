// ==============================|| OVERRIDES - BUTTON ||============================== //

export default function Button(theme) {
  const disabledStyle = {
    '&.Mui-disabled': {
      backgroundColor: theme.palette.grey[200]
    }
  };

  const hoverStyle = {
    '&:hover': {
      color: theme.palette.grey[100]
    }
  };

  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          fontWeight: 400,
          ...hoverStyle
        },
        contained: {
          ...disabledStyle,
          ...hoverStyle
        },
        outlined: {
          ...disabledStyle,
          ...hoverStyle
        }
      }
    }
  };
}
