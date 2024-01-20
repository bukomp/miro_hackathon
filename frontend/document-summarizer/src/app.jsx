import { createRoot } from 'react-dom/client';
import React, { Component } from 'react';
import FileUploadButton from './components/chooseFilesButton';

class App extends Component {
  render() {
    return (
      <div>
        <FileUploadButton />
      </div>
    );
  }
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
