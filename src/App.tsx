import { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Editor from '@monaco-editor/react';
import { JsonPreview } from './components/JsonPreview';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  const [jsonContent, setJsonContent] = useState<string>('{\n  "type": "lesson",\n  "title": "Sample Lesson",\n  "content": "This is a sample lesson content."\n}');

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setJsonContent(value);
    }
  };

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
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
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

export default App; 