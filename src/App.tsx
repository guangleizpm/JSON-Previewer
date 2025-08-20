import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { JsonPreviewer } from './pages/JsonPreviewer';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <JsonPreviewer />
    </ThemeProvider>
  );
}

export default App; 