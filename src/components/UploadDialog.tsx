import { useState, useCallback } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Box,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Stack,
  Chip
} from '@mui/material';
import { useDropzone } from 'react-dropzone';

type ContentType = 'itemList' | 'activity' | 'lesson';

interface UploadedFile {
  file: File;
  name: string;
  content: string;
  isValid: boolean;
  error?: string;
}

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: UploadedFile[]) => void;
  selectedContentType: ContentType;
}

export const UploadDialog: React.FC<UploadDialogProps> = ({
  open,
  onClose,
  onUpload,
  selectedContentType,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 100) {
      alert('Maximum 100 files allowed. Please select fewer files.');
      return;
    }

    setIsProcessing(true);
    const processFiles = async () => {
      const processedFiles: UploadedFile[] = [];
      
      for (const file of acceptedFiles) {
        try {
          if (file.type !== 'application/json') {
            processedFiles.push({
              file,
              name: file.name.replace(/\.json$/, ''),
              content: '',
              isValid: false,
              error: 'Not a JSON file'
            });
            continue;
          }

          const content = await file.text();
          try {
            JSON.parse(content);
            processedFiles.push({
              file,
              name: file.name.replace(/\.json$/, ''),
              content,
              isValid: true
            });
          } catch (err) {
            processedFiles.push({
              file,
              name: file.name.replace(/\.json$/, ''),
              content,
              isValid: false,
              error: 'Invalid JSON format'
            });
          }
        } catch (err) {
          processedFiles.push({
            file,
            name: file.name.replace(/\.json$/, ''),
            content: '',
            isValid: false,
            error: 'Error reading file'
          });
        }
      }
      
      setUploadedFiles(processedFiles);
      setIsProcessing(false);
    };

    processFiles();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    multiple: true,
    maxFiles: 100
  });

  const handleNameChange = (index: number, newName: string) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles[index].name = newName;
    setUploadedFiles(updatedFiles);
  };

  const handleUpload = () => {
    const validFiles = uploadedFiles.filter(f => f.isValid);
    if (validFiles.length === 0) {
      alert('No valid JSON files to upload.');
      return;
    }
    onUpload(validFiles);
    setUploadedFiles([]);
  };

  const getContentTypeDescription = () => {
    switch (selectedContentType) {
      case 'itemList':
        return 'Question pool with items array containing questions and answers';
      case 'activity':
        return 'Activity content with title, content, and optional learning objectives';
      case 'lesson':
        return 'Complete lesson with title, content, and learning objectives';
      default:
        return '';
    }
  };

  const validFilesCount = uploadedFiles.filter(f => f.isValid).length;
  const totalFilesCount = uploadedFiles.length;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Bulk Upload JSON Files</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Content Type: {selectedContentType}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getContentTypeDescription()}
          </Typography>
        </Box>

        {uploadedFiles.length === 0 && (
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.300',
              borderRadius: 1,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: isDragActive ? 'action.hover' : 'background.paper',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <input {...getInputProps()} />
            <Typography variant="h6" gutterBottom>
              {isDragActive ? 'Drop JSON files here' : 'Drag and drop JSON files here, or click to select'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You can select up to 100 JSON files at once
            </Typography>
            {isProcessing && (
              <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
                Processing files...
              </Typography>
            )}
          </Box>
        )}

        {uploadedFiles.length > 0 && (
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Chip 
                label={`${validFilesCount} valid files`} 
                color="success" 
                variant="outlined"
              />
              <Chip 
                label={`${totalFilesCount - validFilesCount} invalid files`} 
                color="error" 
                variant="outlined"
              />
            </Stack>

            <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>File Name</TableCell>
                      <TableCell>Custom Name</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Size</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {uploadedFiles.map((file, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {file.file.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            value={file.name}
                            onChange={(e) => handleNameChange(index, e.target.value)}
                            placeholder="Enter custom name"
                            sx={{ minWidth: 150 }}
                          />
                        </TableCell>
                        <TableCell>
                          {file.isValid ? (
                            <Chip label="Valid" color="success" size="small" />
                          ) : (
                            <Chip label={file.error || 'Invalid'} color="error" size="small" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {(file.file.size / 1024).toFixed(1)} KB
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {uploadedFiles.length > 0 && (
          <Button 
            onClick={handleUpload} 
            variant="contained"
            disabled={validFilesCount === 0}
          >
            Upload {validFilesCount} Valid Files
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}; 