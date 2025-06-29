import React, { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import CustomEditor from "../components/CustomEditor"; // ✅ Correct Lexical Editor Import
import { useNavigate, useParams } from "react-router-dom";
import {useSelector} from 'react-redux';

export default function UpdatePost() {
  const [fileName, setFileName] = useState("No file chosen");
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Uncategorized",
    content: "",
    image: "",
  });
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate();
  const {currentUser} = useSelector(state=>state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/post/getposts?postId=${postId}`
      );
      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        setLoading(false);
        return;
      }

      let content = data.posts[0]?.content || "";
      if (content && typeof content === "object") {
        content = JSON.stringify(content);
      }

      setFormData({
        ...data.posts[0],
        content:
          content ||
          JSON.stringify({
            root: {
              children: [
                {
                  type: "paragraph",
                  children: [],
                },
              ],
              direction: null,
              format: "",
              indent: 0,
              type: "root",
              version: 1,
            },
          }),
      });
    } catch (error) {
      setPublishError("Error fetching post data.");
    } finally {
      setLoading(false);
    }
  };

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
            setFormData({ ...formData, image: downloadURL });
            setImageUploadProgress(null);
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0] ? e.target.files[0].name : "No file chosen");
  };

  const handleEditorChange = (editorState) => {
    try {
      const content = JSON.stringify(editorState.toJSON());
      setFormData({ ...formData, content });
    } catch (error) {
      console.error("Error stringifying editor state:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    try {
        const res = await fetch(
        `/api/post/updatepost/${postId}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      navigate(`/post/${data.slug}`); // Redirect to updated post
    } catch (error) {
      setPublishError("Something went wrong while updating the post.");
    }
  };

  if (loading) {
    return (
      <div className="p-3 max-w-3xl mx-auto min-h-screen">Loading post data...</div>
    );
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl font-semibold my-7">Update Post</h1>
      <form className="flex flex-col gap-4" id="form" onSubmit={handleSubmit}>
        {/* Title and Category */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input
            type="text"
            placeholder="Title"
            required
            id="title"
            value={formData.title}
            className="flex-1 border border-gray-500 bg-gray-100 rounded-sm p-2"
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
            }}
          />
          <select
            id="category"
            value={formData.category}
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
            }}
            className="p-2 border rounded-sm bg-gray-50"
          >
            <option value="Uncategorized">Select Category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">Reactjs</option>
            <option value="nextjs">Nextjs</option>
            <option value="Nodejs">Nodejs</option>
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
            <span className="text-gray-600 w-40 truncate">{fileName}</span>
          </div>
          <button
            type="button"
            className="cursor-pointer border rounded p-1 font-semibold bg-green-500 hover:bg-green-600 text-white"
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16 bg-white">
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
            className="w-40 h-40 object-cover"
          />
        )}

        {/* ✅ Lexical Editor with Initial Content */}
        <CustomEditor
          initialContent={formData.content}
          onChange={handleEditorChange}
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-sm hover:bg-blue-600"
        >
          Update Post
        </button>

        {publishError && (
          <p className="text-red-500 text-center">{publishError}</p>
        )}
      </form>
    </div>
  );
}
