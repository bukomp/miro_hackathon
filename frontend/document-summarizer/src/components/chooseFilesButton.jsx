import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const Input = styled('input')({
  display: 'none',
});

const FileUploadButton = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fileData = () => {
    return selectedFiles.length > 0 ? (
      <Box sx={{ mt: 2, p: 2, border: '1px dashed grey' }}>
        <Typography variant="h6" gutterBottom>
          File Details:
        </Typography>
        {selectedFiles.map((file, index) => (
          <Box key={index}>
            <Typography variant="body1">File Name: {file.name}</Typography>
            <Typography variant="body1">
              Last Modified: {file.lastModifiedDate.toDateString()}
            </Typography>
          </Box>
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
    setSelectedFiles(Array.from(event.target.files));
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
