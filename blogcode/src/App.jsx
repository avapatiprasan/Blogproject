import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import "./App.css";

const API_URL = "https://698d5dffb79d1c928ed51ba9.mockapi.io/data";

const App = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [data, setData] = useState([]);

  async function fetchData() {
    try {
      const result = await fetch(API_URL);
      const jsonResult = await result.json();
      setData(jsonResult.reverse());
    } catch {
      toast.error("Failed to fetch blogs");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function createBlog() {
    if (!title || !description) {
      toast.error("Please fill all fields");
      return;
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        BlogTitle: title,
        BlogDescription: description,
      }),
    });

    if (response.ok) {
      toast.success("Blog Created 🎉");
      setTitle("");
      setDescription("");
      fetchData();
    } else {
      toast.error("Failed to create blog");
    }
  }

  async function deleteBlog(item) {
    const response = await fetch(`${API_URL}/${item.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      toast.success("Blog Deleted 🗑️");
      fetchData();
    } else {
      toast.error("Delete failed");
    }
  }

  async function updateBlog(item) {
    const newTitle = prompt("Enter new title:", item.BlogTitle);
    const newDesc = prompt("Enter new description:", item.BlogDescription);

    if (!newTitle || !newDesc) {
      toast.error("Fields cannot be empty");
      return;
    }

    const response = await fetch(`${API_URL}/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        BlogTitle: newTitle,
        BlogDescription: newDesc,
      }),
    });

    if (response.ok) {
      toast.success("Blog Updated ✨");
      fetchData();
    } else {
      toast.error("Update failed");
    }
  }

  return (
    <div className="app">
      <Toaster position="top-right" />
      <h1 className="heading">Premium Blog App</h1>

      <div className="form-card">
        <input
          type="text"
          placeholder="Enter Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Enter Blog Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="create-btn" onClick={createBlog}>
          Create Blog
        </button>
      </div>

      <div className="blog-list">
        {data.map((item) => (
          <div key={item.id} className="blog-card">
            <h2>{item.BlogTitle}</h2>
            <p>{item.BlogDescription}</p>

            <div className="card-buttons">
              <button
                className="update-btn"
                onClick={() => updateBlog(item)}
              >
                Update
              </button>
              <button
                className="delete-btn"
                onClick={() => deleteBlog(item)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;