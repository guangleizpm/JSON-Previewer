import React from 'react'
import ReactDOM from 'react-dom/client'
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Editor from '@monaco-editor/react';
import { JsonPreview } from './components/JsonPreview';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function Preview() {
  const jsonContent = localStorage.getItem('previewJson') || '{}';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        height: '100vh',
        width: '100vw',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          width: '50%', 
          height: '100%',
          borderRight: '1px solid #ccc'
        }}>
          <Editor
            height="100%"
            defaultLanguage="json"
            value={jsonContent}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              readOnly: true,
            }}
          />
        </Box>
        <Box sx={{ 
          width: '50%', 
          height: '100%',
          overflow: 'auto',
          p: 2
        }}>
          <JsonPreview jsonContent={jsonContent} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Preview />
  </React.StrictMode>,
) 