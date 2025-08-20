import { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Drawer,
  Fab,
  AppBar,
  Toolbar
} from '@mui/material';
import { Save as SaveIcon, Preview as PreviewIcon, Add as AddIcon, Upload as UploadIcon } from '@mui/icons-material';
import { JsonInput } from '../components/JsonInput';
import { JsonPreview } from '../components/JsonPreview';
import { UploadDialog } from '../components/UploadDialog';
import { sampleContent } from '../data/sampleContent';

type ContentType = 'itemList' | 'activity' | 'lesson';

interface JsonFile {
  id: string;
  name: string;
  uploader: string;
  content: string;
  uploadDate: string;
  contentType: ContentType;
  version: number;
  originalFileId?: string;
}

export const JsonPreviewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [jsonContent, setJsonContent] = useState<string>('');
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('lesson');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentEditingFileId, setCurrentEditingFileId] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  // Sample data for demonstration
  const [jsonFiles, setJsonFiles] = useState<JsonFile[]>([
    {
      id: '1',
      name: 'JavaScript Fundamentals Quiz',
      uploader: 'John Doe',
      contentType: 'itemList',
      content: JSON.stringify(sampleContent.itemList, null, 2),
      uploadDate: '2024-03-20',
      version: 1,
      originalFileId: '1'
    },
    {
      id: '2',
      name: 'JavaScript Variables Practice',
      uploader: 'Jane Smith',
      contentType: 'activity',
      content: JSON.stringify(sampleContent.activity, null, 2),
      uploadDate: '2024-03-21',
      version: 1,
      originalFileId: '2'
    },
    {
      id: '3',
      name: 'Introduction to JavaScript',
      uploader: 'Mike Johnson',
      contentType: 'lesson',
      content: JSON.stringify(sampleContent.lesson, null, 2),
      uploadDate: '2024-03-22',
      version: 1,
      originalFileId: '3'
    }
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    const contentTypes: ContentType[] = ['itemList', 'activity', 'lesson'];
    setSelectedContentType(contentTypes[newValue]);
  };

  const handleJsonChange = (newContent: string) => {
    setJsonContent(newContent);
    setValidationMessage(null);
  };

  const handleFileUpload = (files: any[]) => {
    // Process multiple files
    files.forEach((uploadedFile, index) => {
      const { name, content } = uploadedFile;
      
      // Create a new file entry for each uploaded file
      const newFile: JsonFile = {
        id: Date.now().toString() + index, // Ensure unique IDs
        name: name,
        uploader: 'Current User',
        contentType: selectedContentType,
        content: content,
        uploadDate: new Date().toLocaleDateString(),
        version: 1,
      };
      
      setJsonFiles(prevFiles => [...prevFiles, newFile]);
    });
    
    setIsUploadDialogOpen(false);
    setCurrentEditingFileId(null);
    
    setValidationMessage({
      type: 'success',
      message: `${files.length} files uploaded successfully! They have been added to the ${selectedContentType} library.`
    });
  };

  const handleSave = (content: string) => {
    setJsonContent(content);
    setIsSaveDialogOpen(true);
  };

  const handleSaveConfirm = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      const fileName = parsed.title || `New ${selectedContentType}`;
      
      if (currentEditingFileId) {
        const existingFile = jsonFiles.find(f => f.id === currentEditingFileId);
        if (!existingFile) {
          setValidationMessage({
            type: 'error',
            message: 'Error saving content: File not found.'
          });
          return;
        }

        const newVersion: JsonFile = {
          id: Date.now().toString(),
          name: `${fileName} (v${existingFile.version + 1})`,
          uploader: 'Current User',
          contentType: selectedContentType,
          content: jsonContent,
          uploadDate: new Date().toLocaleDateString(),
          version: existingFile.version + 1,
          originalFileId: existingFile.id,
        };
        
        setJsonFiles(prevFiles => [...prevFiles, newVersion]);
        
        setValidationMessage({
          type: 'success',
          message: `New version of "${fileName}" saved to ${selectedContentType} library!`
        });
      } else {
        const newFile: JsonFile = {
          id: Date.now().toString(),
          name: fileName,
          uploader: 'Current User',
          contentType: selectedContentType,
          content: jsonContent,
          uploadDate: new Date().toLocaleDateString(),
          version: 1,
        };
        
        setJsonFiles(prevFiles => [...prevFiles, newFile]);
        
        setValidationMessage({
          type: 'success',
          message: `"${fileName}" successfully saved to ${selectedContentType} library and is ready for use in CTK/COSMOS!`
        });
      }
    } catch (err) {
      setValidationMessage({
        type: 'error',
        message: 'Error saving content: Invalid JSON format'
      });
    }
    
    setIsSaveDialogOpen(false);
  };

  const validateContent = (content: string, contentType: ContentType) => {
    try {
      const parsed = JSON.parse(content);
      
      let isValid = false;
      let errorMessage = '';
      
      switch (contentType) {
        case 'itemList':
          isValid = parsed.type === 'itemList' && Array.isArray(parsed.items);
          errorMessage = 'ItemList must have type "itemList" and contain an "items" array';
          break;
        case 'activity':
          isValid = parsed.type === 'activity' && parsed.title && parsed.content;
          errorMessage = 'Activity must have type "activity", title, and content';
          break;
        case 'lesson':
          isValid = parsed.type === 'lesson' && parsed.title && parsed.content;
          errorMessage = 'Lesson must have type "lesson", title, and content';
          break;
      }
      
      if (isValid) {
        setValidationMessage({
          type: 'success',
          message: `Content validation successful! This ${contentType} is ready for CTK/COSMOS.`
        });
      } else {
        setValidationMessage({
          type: 'error',
          message: `Validation failed: ${errorMessage}`
        });
      }
    } catch (err) {
      setValidationMessage({
        type: 'error',
        message: 'Invalid JSON format. Please check your content.'
      });
    }
  };

  const handleContentTypeChange = (contentType: ContentType) => {
    setSelectedContentType(contentType);
    if (jsonContent) {
      validateContent(jsonContent, contentType);
    }
  };

  const loadSampleContent = () => {
    const sample = sampleContent[selectedContentType];
    const sampleJson = JSON.stringify(sample, null, 2);
    setJsonContent(sampleJson);
    setCurrentEditingFileId(null);
    validateContent(sampleJson, selectedContentType);
  };

  const handlePreview = (jsonFile: JsonFile) => {
    setJsonContent(jsonFile.content);
    setSelectedContentType(jsonFile.contentType);
    setCurrentEditingFileId(jsonFile.id);
    validateContent(jsonFile.content, jsonFile.contentType);
    setIsDrawerOpen(true);
  };

  const getFilteredFiles = () => {
    return jsonFiles.filter(file => file.contentType === selectedContentType);
  };

  const tabLabels = ['ItemLists', 'Activities', 'Lessons'];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CTK/COSMOS Content Ingestion System
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Container maxWidth="xl">
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ minHeight: 64 }}>
              {tabLabels.map((label, index) => (
                <Tab key={index} label={label} sx={{ minHeight: 64, fontSize: '1.1rem' }} />
              ))}
            </Tabs>
          </Container>
        </Box>

        {/* Library Content */}
        <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h2">
              {tabLabels[activeTab]} Library
            </Typography>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => setIsDrawerOpen(true)}
              size="large"
            >
              Upload New {tabLabels[activeTab].slice(0, -1)}
            </Button>
          </Box>

          {/* Library Table */}
          <Paper sx={{ width: '100%' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Version</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Uploader</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Upload Date</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredFiles().map((file) => (
                    <TableRow key={file.id} hover>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {file.name}
                        </Typography>
                        {file.originalFileId && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            Version of: {jsonFiles.find(f => f.id === file.originalFileId)?.name || 'Unknown'}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="primary" fontWeight="medium">
                          v{file.version}
                        </Typography>
                      </TableCell>
                      <TableCell>{file.uploader}</TableCell>
                      <TableCell>{file.uploadDate}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handlePreview(file)}
                          size="large"
                        >
                          <PreviewIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>

      {/* Upload/Preview Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: { width: '80%', maxWidth: 1200 }
        }}
      >
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              {currentEditingFileId ? 'Edit Content' : 'Upload & Preview Content'}
            </Typography>
            <Button onClick={() => setIsDrawerOpen(false)}>Close</Button>
          </Box>

          {/* Content Type Selection */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Content Type</InputLabel>
                <Select
                  value={selectedContentType}
                  label="Content Type"
                  onChange={(e) => handleContentTypeChange(e.target.value as ContentType)}
                >
                  <MenuItem value="itemList">ItemList (Question Pool)</MenuItem>
                  <MenuItem value="activity">Activity (Warm-up, Instruction, Summary, Assignment)</MenuItem>
                  <MenuItem value="lesson">Lesson (Complete Collection)</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                variant="outlined" 
                onClick={loadSampleContent}
              >
                Load Sample {selectedContentType}
              </Button>

              <Button 
                variant="contained" 
                onClick={() => setIsUploadDialogOpen(true)}
                startIcon={<UploadIcon />}
              >
                Upload JSON File
              </Button>
            </Stack>

            {validationMessage && (
              <Alert severity={validationMessage.type} sx={{ mt: 2 }}>
                {validationMessage.message}
              </Alert>
            )}
          </Paper>

          {/* Content Editor */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, flexGrow: 1 }}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                JSON Input
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <JsonInput 
                  value={jsonContent} 
                  onChange={handleJsonChange} 
                />
              </Box>
            </Paper>
            
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Content Preview & Validation
              </Typography>
              <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                <JsonPreview 
                  jsonContent={jsonContent} 
                  onSave={handleSave}
                  contentType={selectedContentType}
                />
              </Box>
            </Paper>
          </Box>
        </Box>
      </Drawer>

      {/* Upload Dialog */}
      <UploadDialog
        open={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUpload={handleFileUpload}
        selectedContentType={selectedContentType}
      />

      {/* Save Confirmation Dialog */}
      <Dialog open={isSaveDialogOpen} onClose={() => setIsSaveDialogOpen(false)}>
        <DialogTitle>
          {currentEditingFileId ? 'Save New Version' : 'Save to Library'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {currentEditingFileId 
              ? 'Are you sure you want to create a new version of this content?'
              : 'Are you sure you want to save this content to the library?'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Content type: {selectedContentType}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveConfirm} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 