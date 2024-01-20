import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const Input = styled('input')({
  display: 'none',
});

const FileName = styled(Typography)(({ theme }) => ({
  maxWidth: '230px',
  wordBreak: 'break-word',
}));

const FileDetailsPaper = styled(Paper)({
  backgroundColor: '#f5f5f5',
  marginTop: '8px',
  padding: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '10px',
});

const FileUploadButton = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileDelete = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const fileData = () => {
    return selectedFiles.length > 0 ? (
      <Box sx={{ mt: 2, p: 2, border: '1px dashed grey' }}>
        <Typography variant="h6" gutterBottom>
          Uploaded files:
        </Typography>
        {selectedFiles.map((file, index) => (
          <FileDetailsPaper key={index} elevation={2}>
            <FileName variant="body2">{file.name}</FileName>
            <IconButton
              aria-label="delete"
              onClick={() => handleFileDelete(index)}
            >
              <DeleteIcon />
            </IconButton>
          </FileDetailsPaper>
        ))}
        <Button
          variant="contained"
          color="primary"
          onClick={onFileUpload}
          size="small"
          sx={{ mt: 2 }}
        >
          Make your life easier
        </Button>
      </Box>
    ) : null;
  };

  const onFileChange = (event) => {
    setSelectedFiles([...selectedFiles, ...Array.from(event.target.files)]);
  };

  const onFileUpload = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('myFiles', file, file.name);
    });

    // Log files for debugging
    for (let value of formData.values()) {
      console.log(value);
    }

    // TODO: change the API call to your backend
    const response = await axios.post('https://httpbin.org/post', formData);
    console.log(response.data);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
      <label htmlFor="fileInput">
        <Input
          accept="*"
          id="fileInput"
          type="file"
          multiple
          onChange={onFileChange}
        />
        <Button
          variant="contained"
          color="secondary"
          component="span"
          size="small"
        >
          Choose Files
        </Button>
      </label>
      {fileData()}
    </Paper>
  );
};

export default FileUploadButton;
