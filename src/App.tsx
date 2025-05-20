import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { JsonManager } from './components/JsonManager';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <JsonManager />
    </ThemeProvider>
  );
}

export default App; 