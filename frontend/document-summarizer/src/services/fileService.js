import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

// Send files to server
const uploadFiles = async (files, keywords) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file, file.name);
    console.log(file);
  });

  if (keywords) {
    formData.append('keywords', keywords);
  }

  try {
    const response = await axios.post(`${BASE_URL}/uploadFile`, formData);
    return response.data;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};

export default uploadFiles;
