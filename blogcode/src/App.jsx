import React, { useEffect, useState } from 'react'
import { Toaster, toast } from "react-hot-toast"
import "./App.css"

const App = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [data, setData] = useState([])

  const newBlog = {
    BlogTitle: title,
    BlogDescription: description
  }

  async function createBlog() {
    if (!title || !description) {
      toast.error("Please fill all fields")
      return
    }

    const response = await fetch(
      "https://698d5dffb79d1c928ed51ba9.mockapi.io/data",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newBlog)
      }
    )

    if (response.ok) {
      toast.success("Blog Created Successfully 🎉")
      fetchData()
      setTitle("")
      setDescription("")
    } else {
      toast.error("Failed to create blog")
    }
  }

  async function fetchData() {
    const result = await fetch(
      "https://698d5dffb79d1c928ed51ba9.mockapi.io/data/"
    )
    const jsonResult = await result.json()
    setData(jsonResult.reverse())
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function deleteBlog(blogItem) {
    const deletedBlog = await fetch(
      `https://698d5dffb79d1c928ed51ba9.mockapi.io/data/${blogItem.id}`,
      {
        method: "DELETE"
      }
    )

    if (deletedBlog.ok) {
      toast.success("Blog Deleted 🗑️")
      fetchData()
    } else {
      toast.error("Failed to delete blog")
    }
  }

  async function updateBlog(updateItem) {
    const newTitle = prompt("Enter new Title:")
    const newDescription = prompt("Enter new Description:")

    if (!newTitle || !newDescription) {
      toast.error("Fields cannot be empty")
      return
    }

    const updatedblog = {
      BlogTitle: newTitle,
      BlogDescription: newDescription
    }

    const blogUpdated = await fetch(
      `https://698d5dffb79d1c928ed51ba9.mockapi.io/data/${updateItem.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedblog)
      }
    )

    if (blogUpdated.ok) {
      toast.success("Blog Updated ✨")
      fetchData()
    } else {
      toast.error("Failed to update blog")
    }
  }

  return (
    <div className="app">
      <Toaster />

      <h1 className="heading">Premium Blog App</h1>

      <div className="form-card">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Enter Blog Title"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter Blog Description"
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
  )
}

export default App
