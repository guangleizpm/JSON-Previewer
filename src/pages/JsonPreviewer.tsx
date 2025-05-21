import { useState } from 'react';
import { Box, Container, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { JsonInput } from '../components/JsonInput';
import { JsonPreview } from '../components/JsonPreview';
import { UploadDialog } from '../components/UploadDialog';

export const JsonPreviewer: React.FC = () => {
  const [jsonContent, setJsonContent] = useState<string>('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [saveType, setSaveType] = useState<'overwrite' | 'new' | null>(null);

  const handleJsonChange = (newContent: string) => {
    setJsonContent(newContent);
  };

  const handleFileUpload = (content: string) => {
    setJsonContent(content);
    setIsUploadDialogOpen(false);
  };

  const handleSave = (content: string, isNewVersion: boolean) => {
    setJsonContent(content);
    setSaveType(isNewVersion ? 'new' : 'overwrite');
    setIsSaveDialogOpen(true);
  };

  const handleSaveConfirm = () => {
    // Here you would typically make an API call to save the content
    console.log('Saving content:', jsonContent);
    console.log('Save type:', saveType);
    setIsSaveDialogOpen(false);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          JSON Previewer
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={() => setIsUploadDialogOpen(true)}
          >
            Upload JSON File
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Paper sx={{ p: 2 }}>
            <JsonInput 
              value={jsonContent} 
              onChange={handleJsonChange} 
            />
          </Paper>
          
          <Paper sx={{ p: 2 }}>
            <JsonPreview 
              jsonContent={jsonContent} 
              onSave={handleSave}
            />
          </Paper>
        </Box>
      </Box>

      <UploadDialog
        open={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUpload={handleFileUpload}
      />

      <Dialog open={isSaveDialogOpen} onClose={() => setIsSaveDialogOpen(false)}>
        <DialogTitle>
          {saveType === 'overwrite' ? 'Save Changes' : 'Save as New Version'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {saveType === 'overwrite' 
              ? 'Are you sure you want to overwrite the current version?'
              : 'Are you sure you want to save this as a new version?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveConfirm} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}; 