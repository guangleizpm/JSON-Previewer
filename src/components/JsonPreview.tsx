import { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Stack, Chip } from '@mui/material';
import { Save as SaveIcon, SaveAs as SaveAsIcon } from '@mui/icons-material';

type ContentType = 'itemList' | 'activity' | 'lesson';

interface JsonPreviewProps {
  jsonContent: string;
  onSave?: (content: string, isNewVersion: boolean) => void;
  readOnly?: boolean;
  contentType?: ContentType;
}

export const JsonPreview: React.FC<JsonPreviewProps> = ({ 
  jsonContent, 
  onSave,
  readOnly = false,
  contentType = 'lesson'
}) => {
  const [parsedContent, setParsedContent] = useState<any>(null);
  const [editedContent, setEditedContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const parsed = JSON.parse(jsonContent);
      setParsedContent(parsed);
      setEditedContent(parsed);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
    }
  }, [jsonContent]);

  const handleContentChange = (field: string, value: string) => {
    if (!editedContent) return;
    
    setEditedContent({
      ...editedContent,
      [field]: value
    });
  };

  const handleLearningObjectiveChange = (index: number, value: string) => {
    if (!editedContent?.learningObjectives) return;
    
    const newObjectives = [...editedContent.learningObjectives];
    newObjectives[index] = value;
    
    setEditedContent({
      ...editedContent,
      learningObjectives: newObjectives
    });
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    if (!editedContent?.items) return;
    
    const newItems = [...editedContent.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    
    setEditedContent({
      ...editedContent,
      items: newItems
    });
  };

  const handleSave = (isNewVersion: boolean) => {
    if (!editedContent || !onSave) return;
    
    try {
      const updatedJson = JSON.stringify(editedContent, null, 2);
      onSave(updatedJson, isNewVersion);
    } catch (e) {
      setError('Error saving changes');
    }
  };

  if (error) {
    return (
      <Paper sx={{ p: 2, bgcolor: '#fff3f3' }}>
        <Typography color="error">Error: {error}</Typography>
      </Paper>
    );
  }

  if (!editedContent) return null;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 2 }}>
        <Chip 
          label={`Content Type: ${contentType}`} 
          color="primary" 
          variant="outlined"
        />
      </Box>

      {!readOnly && (
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => handleSave()}
          >
            Save Changes
          </Button>
        </Stack>
      )}

      <Box>
        <Typography variant="h6" gutterBottom>
          Title
        </Typography>
        <TextField
          fullWidth
          value={editedContent.title || ''}
          onChange={(e) => handleContentChange('title', e.target.value)}
          disabled={readOnly}
          sx={{ mb: 3 }}
        />

        <Typography variant="h6" gutterBottom>
          Content
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={editedContent.content || ''}
          onChange={(e) => handleContentChange('content', e.target.value)}
          disabled={readOnly}
          sx={{ mb: 3 }}
        />

        {editedContent.learningObjectives && (
          <Box mt={2}>
            <Typography variant="h6" gutterBottom>
              Learning Objectives
            </Typography>
            {editedContent.learningObjectives.map((objective: string, index: number) => (
              <TextField
                key={index}
                fullWidth
                value={objective}
                onChange={(e) => handleLearningObjectiveChange(index, e.target.value)}
                disabled={readOnly}
                sx={{ mb: 2 }}
              />
            ))}
          </Box>
        )}

        {editedContent.items && contentType === 'itemList' && (
          <Box mt={2}>
            <Typography variant="h6" gutterBottom>
              Items
            </Typography>
            {editedContent.items.map((item: any, index: number) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Item {index + 1}
                </Typography>
                <TextField
                  fullWidth
                  label="Question"
                  value={item.question || ''}
                  onChange={(e) => handleItemChange(index, 'question', e.target.value)}
                  disabled={readOnly}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Answer"
                  value={item.answer || ''}
                  onChange={(e) => handleItemChange(index, 'answer', e.target.value)}
                  disabled={readOnly}
                  sx={{ mb: 2 }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}; 