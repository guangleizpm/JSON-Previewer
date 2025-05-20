import { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import { Add as AddIcon, Preview as PreviewIcon, Upload as UploadIcon } from '@mui/icons-material';

interface JsonFile {
  id: string;
  name: string;
  uploader: string;
  content: string;
  uploadDate: string;
}

const sampleJsonFiles: JsonFile[] = [
  {
    id: '1',
    name: 'Introduction to React Hooks',
    uploader: 'John Doe',
    content: JSON.stringify({
      type: 'lesson',
      title: 'Introduction to React Hooks',
      content: 'React Hooks are functions that let you "hook into" React state and lifecycle features from function components. This lesson covers the basics of useState and useEffect hooks.',
      learningObjectives: [
        'Understand the concept of React Hooks',
        'Learn how to use useState for state management',
        'Master useEffect for handling side effects',
        'Practice creating custom hooks'
      ]
    }, null, 2),
    uploadDate: '2024-03-20'
  },
  {
    id: '2',
    name: 'Advanced TypeScript Patterns',
    uploader: 'Jane Smith',
    content: JSON.stringify({
      type: 'lesson',
      title: 'Advanced TypeScript Patterns',
      content: 'This lesson explores advanced TypeScript patterns and best practices for building robust applications. Learn about generics, utility types, and type inference.',
      learningObjectives: [
        'Master TypeScript generics and their applications',
        'Understand utility types and type manipulation',
        'Learn advanced type inference techniques',
        'Apply TypeScript patterns in real-world scenarios'
      ]
    }, null, 2),
    uploadDate: '2024-03-21'
  }
];

export const JsonManager: React.FC = () => {
  const [jsonFiles, setJsonFiles] = useState<JsonFile[]>(sampleJsonFiles);
  const [openUpload, setOpenUpload] = useState(false);
  const [uploadTab, setUploadTab] = useState(0);
  const [newFile, setNewFile] = useState<{
    name: string;
    uploader: string;
    content: string;
  }>({
    name: '',
    uploader: '',
    content: '',
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = () => {
    if (!newFile.name || !newFile.uploader || !newFile.content) {
      return;
    }

    try {
      // Validate JSON
      JSON.parse(newFile.content);

      const newJsonFile: JsonFile = {
        id: Date.now().toString(),
        name: newFile.name,
        uploader: newFile.uploader,
        content: newFile.content,
        uploadDate: new Date().toLocaleDateString(),
      };

      setJsonFiles([...jsonFiles, newJsonFile]);
      setOpenUpload(false);
      setNewFile({ name: '', uploader: '', content: '' });
    } catch (error) {
      alert('Invalid JSON format');
    }
  };

  const handlePreview = (jsonFile: JsonFile) => {
    localStorage.setItem('previewJson', jsonFile.content);
    window.open('/preview.html', '_blank');
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Validate JSON
        JSON.parse(content);
        
        // Extract name from filename (remove .json extension)
        const name = file.name.replace(/\.json$/, '');
        
        setNewFile({
          name,
          uploader: newFile.uploader,
          content,
        });
      } catch (error) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      handleFileUpload(file);
    } else {
      alert('Please upload a JSON file');
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">JSON Files</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenUpload(true)}
        >
          Upload New JSON
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Uploader</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jsonFiles.map((file) => (
              <TableRow key={file.id}>
                <TableCell>{file.name}</TableCell>
                <TableCell>{file.uploader}</TableCell>
                <TableCell>{file.uploadDate}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handlePreview(file)}
                  >
                    <PreviewIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openUpload} onClose={() => setOpenUpload(false)} maxWidth="md" fullWidth>
        <DialogTitle>Upload New JSON</DialogTitle>
        <DialogContent>
          <Tabs
            value={uploadTab}
            onChange={(_, newValue) => setUploadTab(newValue)}
            sx={{ mb: 2 }}
          >
            <Tab label="Manual Input" />
            <Tab label="File Upload" />
          </Tabs>

          {uploadTab === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="File Name"
                value={newFile.name}
                onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="Uploader Name"
                value={newFile.uploader}
                onChange={(e) => setNewFile({ ...newFile, uploader: e.target.value })}
                fullWidth
              />
              <TextField
                label="JSON Content"
                value={newFile.content}
                onChange={(e) => setNewFile({ ...newFile, content: e.target.value })}
                multiline
                rows={10}
                fullWidth
              />
            </Box>
          ) : (
            <Box
              sx={{
                border: '2px dashed',
                borderColor: isDragging ? 'primary.main' : 'grey.300',
                borderRadius: 1,
                p: 3,
                textAlign: 'center',
                bgcolor: isDragging ? 'action.hover' : 'background.paper',
                transition: 'all 0.2s ease',
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".json"
                onChange={handleFileInput}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Choose File
                </Button>
              </label>
              <Typography variant="body1" color="textSecondary">
                or drag and drop a JSON file here
              </Typography>
              {newFile.name && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Selected file: {newFile.name}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpload(false)}>Cancel</Button>
          <Button onClick={handleUpload} variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 