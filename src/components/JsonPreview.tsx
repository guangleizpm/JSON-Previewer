import { Box, Typography, Paper } from '@mui/material';

interface JsonPreviewProps {
  jsonContent: string;
}

export const JsonPreview: React.FC<JsonPreviewProps> = ({ jsonContent }) => {
  let parsedContent;
  let error = null;

  try {
    parsedContent = JSON.parse(jsonContent);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Invalid JSON';
  }

  if (error) {
    return (
      <Paper sx={{ p: 2, bgcolor: '#fff3f3' }}>
        <Typography color="error">Error: {error}</Typography>
      </Paper>
    );
  }

  const renderContent = (content: any) => {
    if (!content) return null;

    switch (content.type) {
      case 'lesson':
        return (
          <Box>
            <Typography variant="h4" gutterBottom>
              {content.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {content.content}
            </Typography>
            {content.learningObjectives && (
              <Box mt={2}>
                <Typography variant="h6" gutterBottom>
                  Learning Objectives
                </Typography>
                <ul>
                  {content.learningObjectives.map((objective: string, index: number) => (
                    <li key={index}>
                      <Typography variant="body1">{objective}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </Box>
        );
      
      case 'activity':
        return (
          <Box>
            <Typography variant="h4" gutterBottom>
              {content.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {content.description}
            </Typography>
            {content.steps && (
              <Box mt={2}>
                <Typography variant="h6" gutterBottom>
                  Steps
                </Typography>
                <ol>
                  {content.steps.map((step: string, index: number) => (
                    <li key={index}>
                      <Typography variant="body1">{step}</Typography>
                    </li>
                  ))}
                </ol>
              </Box>
            )}
          </Box>
        );

      default:
        return (
          <Typography color="error">
            Unknown content type: {content.type}
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {renderContent(parsedContent)}
    </Box>
  );
}; 