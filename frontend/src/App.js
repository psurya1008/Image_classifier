import React, { useState } from "react";
import './App.css'

function App() {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);
  

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const { tags } = await response.json();
      setTags(tags);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form class="container text-center" onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {tags.length > 0 && (
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Original Image</th>
              <th>Best Guess</th>
              <th>Possible Guesses</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <img src={URL.createObjectURL(file)} alt="Uploaded Image" />
              </td>
              <td>{tags[0]}</td>
              <td>
                {tags.slice(1).map((tag) => (
                  <div key={tag}>{tag}</div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;

