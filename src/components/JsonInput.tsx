import { Box, TextField } from '@mui/material';

interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const JsonInput: React.FC<JsonInputProps> = ({ value, onChange }) => {
  return (
    <Box>
      <TextField
        fullWidth
        multiline
        rows={20}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter or paste your JSON here..."
        sx={{
          '& .MuiInputBase-root': {
            fontFamily: 'monospace',
          },
        }}
      />
    </Box>
  );
}; 