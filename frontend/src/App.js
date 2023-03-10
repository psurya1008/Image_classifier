import React, { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);
  const [disabled,setDisabled]=useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const fileSizeInMB = selectedFile.size / (250 * 1024);
    if (fileSizeInMB > 1) {
      setError("File size should be less than 250 KB");
      setFile(null);
    } else {
      setFile(selectedFile);
      setError(null);
    }
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
      setDisabled(true);
    } catch (error) {
      console.error(error);
    }
  };
  const clear =()=>{
    setDisabled(false);
    setFile(null);
  }

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center">

      {!disabled?(<div>
        <h1 class="text-4xl font-bold text-center text-black-800 mb-8">Image Classifier</h1>
      <form className="flex flex-col items-center justify-center h-screen" onSubmit={handleSubmit}>
        <input className="border-2 border-gray-400 py-2 px-4 rounded-lg" type="file" onChange={handleFileChange} />
        {error && <div className="text-danger">{error}</div>}
        <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit" disabled={!file}>
          Upload
        </button>
      </form>
      </div>): (
        <div className="flex flex-col items-center justify-center h-screen">
       <table className="table-auto border-2 border-gray-400">
       <thead>
         <tr>
           <th className="px-4 py-2 border">Original Image</th>
           <th className="px-4 py-2 border">Best Guess</th>
           <th className="px-4 py-2 border">Possible Guesses</th>
         </tr>
       </thead>
       <tbody>
         <tr>
           <td className="border px-4 py-2">
             {file && <img id="photo" className="max-w-full h-auto" src={URL.createObjectURL(file)} alt="Uploaded Image" />}
           </td>
           <td className="border px-4 py-2">{tags.length > 0 ? tags[0] : "-"}</td>
           <td className="border px-4 py-2">
             {tags.length > 1 ? tags.slice(1).map((tag) => (
               <div key={tag}>{tag}</div>
             )) : "-"}
           </td>
         </tr>
       </tbody>
     </table>
     <button  className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={clear}>clear</button>
     </div>     
      )}
      
      
    </div>
  );
}

export default App;
