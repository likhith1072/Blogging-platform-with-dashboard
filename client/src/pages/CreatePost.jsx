import React, { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import CustomEditor from "../components/CustomEditor"; // Import Lexical Editor
import {useNavigate} from 'react-router-dom';

export default function CreatePost() {
  const [fileName, setFileName] = useState("No file chosen");
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  
  const navigate=useNavigate();

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select a file to upload");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError(error.message);
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadError(null);
            setImageUploadProgress(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image Upload failed");
      setImageUploadProgress(null);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("No file chosen");
    }
  };

  // Handle Lexical Editor content change
  const handleEditorChange = (editorState) => {
    console.log(JSON.stringify(editorState));
    setFormData({ ...formData, content: JSON.stringify(editorState) });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(formData.content);
    try{
      const res=await fetch("http://localhost:3000/api/post/create",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      credentials:"include",
      body:JSON.stringify(formData),
    });
    const data=await res.json();
    if(!res.ok){
      setPublishError(data.message);
      return;
    }
    if(res.ok)
    {setPublishError(null);
    navigate(`/post/${data.slug}`);
    }
  }
   catch(error) {
    setPublishError('Something went wrong');
  }
};

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl font-semibold my-7">Create Post</h1>
      <form className="flex flex-col gap-4" id='form' onSubmit={handleSubmit}>
        {/* Title and Category */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1 border border-gray-500 bg-gray-100 rounded-sm p-2 dark:bg-gray-600"
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
            }}
          />
          <select
            id="category"
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
            }}
            className="p-2 border dark:border-gray-800 rounded-sm bg-gray-50 dark:bg-gray-600"
          >
            <option value="Uncategorized">Select Category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">Reactjs</option>
            <option value="nextjs">Nextjs</option>
            <option value="Nodejs">Nodejs</option>
            <option value="tailwindcss">Tailwindcss</option>
          </select>
        </div>

        {/* File Upload Section */}
        <div className="flex gap-4 items-center justify-between border-4 border-teal-600 border-dotted p-3">
          <div className="border border-gray-500 rounded-sm flex gap-2 items-center text-sm sm:text-md">
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="fileInput"
              className="bg-blue-500 text-white px-4 py-2 cursor-pointer hover:bg-blue-600 font-semibold"
            >
              Choose File
            </label>
            <span className="text-gray-600 w-40 truncate dark:text-gray-300">{fileName}</span>
          </div>
          {/* Upload Button */}
          <button
            type="button"
            className="cursor-pointer borderdark:border-gray-800 rounded p-1 font-semibold bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700"
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16 bg-white dark:bg-gray-700 text-gray-300">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </button>
        </div>

        {imageUploadError && (
          <div className="bg-red-100 text-red-400 rounded-sm p-1">
            {imageUploadError}
          </div>
        )}

        {formData.image && (
          <img
            src={formData.image}
            alt="uploaded"
            className="w-40 h-40 object-cover mx-auto"
          />
        )}

        {/* Lexical Editor Section */}
        <div className="border dark:border-gray-800  min-h-[300px] bg-white shadow-sm dark:bg-gray-700 dark:rounded-md">
          <CustomEditor onChange={handleEditorChange} />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="cursor-pointer border dark:border-gray-800 rounded p-2 font-semibold bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 dark:from-purple-600 dark:to-purple-700 dark:hover:from-purple-700  dark:hover:to-purple-800 text-grey-300"
        >
          Publish
        </button>

       {publishError && <div className="bg-red-200 text-red-400 p-1">{publishError} </div>}

      </form>
    </div>
  );
}
