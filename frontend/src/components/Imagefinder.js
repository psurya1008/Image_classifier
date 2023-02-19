import axios from 'axios';
import React, { useState } from 'react';



export const ImageFinder =()=> {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.includes('image')) {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Invalid file type');
    }
  };

const apiKey = "AIzaSyD_rIX8sFGmNYlNvV6BKo3v9QQoCLeYffU";

const handleFileUpload = () => {
  if (file) {
    const formData = new FormData();
    formData.append('image', file);
    axios.post('/api/upload-image', formData, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
    })
      .then((response) => {
        setTags(response.data.tags);
        setError(null);
      })
      .catch((error) => {
        console.error(error);
        setError('Error uploading image');
      });
  } else {
    setError('Please select a file');
  }
};


  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
      {error && <div>{error}</div>}
      {tags.length > 0 &&
        <ul>
          {tags.map((tag, index) => (
            <li key={index}>{tag}</li>
          ))}
        </ul>
      }
    </div>
  );
}
