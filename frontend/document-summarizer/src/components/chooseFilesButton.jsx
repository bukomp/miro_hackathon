import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
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
      <>
        <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
          Uploaded files:
        </Typography>
        <Box
          sx={{
            p: 2,
            border: '1px dashed grey',
            maxHeight: '400px',
            overflowY: 'auto',
            width: '90%',
          }}
        >
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
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={onFileUpload}
          size="small"
          sx={{ mt: 2, width: '70%' }}
        >
          Make your life easier
        </Button>
      </>
    ) : (
      <Box
        sx={{
          mt: 2,
          p: 2,
          border: '1px dashed grey',
          width: '90%',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Typography
          variant="subtitle1"
          gutterBottom
          style={{ marginBottom: '30px' }}
        >
          NO NEED TO READ BORING DOCUMENTS ANYMORE!🔥 <br />
          Document summarizer creates a mindmap from your uploaded files
          ╰(*°▽°*)╯
        </Typography>
        <Typography variant="body2">
          Click "Choose Files" to select the files you want to upload. You can
          select up to 10 files with the following formats: .pdf, .txt, .docx,
          .rtf.
        </Typography>
      </Box>
    );
  };

  const onFileChange = (event) => {
    // Only 10 files
    const newFilesArray = [
      ...selectedFiles,
      ...Array.from(event.target.files),
    ].slice(0, 10);
    setSelectedFiles(newFilesArray);
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <div>
        <label
          htmlFor="fileInput"
          style={{ marginRight: '10px', marginLeft: '50px' }}
        >
          <Input
            accept=".pdf,.txt,.docx,.rtf"
            id="fileInput"
            type="file"
            multiple
            onChange={onFileChange}
          />
          <Button
            variant="contained"
            color="secondary"
            component="span"
            size="large"
            style={{
              minWidth: '200px',
              padding: '10px 30px',
            }}
          >
            Choose Files
          </Button>
        </label>
        <Tooltip
          title="Only PDF, TXT, DOCX, and RTF formats. Max 10 files. Multiple files can be chosen. 😊"
          placement="top"
          arrow
        >
          <IconButton>
            <HelpOutlineIcon color="action" />
          </IconButton>
        </Tooltip>
      </div>
      {fileData()}
    </div>
  );
};

export default FileUploadButton;
