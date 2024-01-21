import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { styled } from '@mui/material/styles';
import uploadFiles from '../services/fileService';

const Input = styled('input')({
  display: 'none'
});

const FileName = styled(Typography)(({ theme }) => ({
  maxWidth: '230px',
  wordBreak: 'break-word'
}));

const FileDetailsPaper = styled(Paper)({
  backgroundColor: '#f5f5f5',
  marginTop: '8px',
  padding: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '10px'
});

const FileUploadButton = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [keyWords, setKeyWords] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileDelete = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const handleKeyNotesChange = (event) => {
    setKeyWords(event.target.value);
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      await uploadFiles(selectedFiles, keyWords);
    } catch (error) {
      // Handle any errors here
    } finally {
      setIsUploading(false);
    }
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
            maxHeight: '300px',
            overflowY: 'auto',
            width: '90%'
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

        <TextField
          label="Keywords"
          variant="outlined"
          fullWidth
          margin="normal"
          value={keyWords}
          onChange={handleKeyNotesChange}
          helperText="Enter keywords you want the mindmap to concentrate on."
          sx={{ width: '90%', marginTop: '30px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => uploadFiles(selectedFiles, keyWords)}
          size="small"
          sx={{ width: '70%' }}
        >
          Make your life easier
        </Button>

        {isUploading && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Please wait, your mindmap is brewing. This may take a few minutes.
          </Typography>
        )}
      </>
    ) : (
      <Box
        sx={{
          mt: 2,
          p: 2,
          border: '1px dashed grey',
          width: '90%',
          backgroundColor: '#f5f5f5'
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
      ...Array.from(event.target.files)
    ].slice(0, 10);
    setSelectedFiles(newFilesArray);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
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
              padding: '10px 30px'
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
