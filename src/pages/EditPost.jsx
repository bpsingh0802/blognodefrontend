import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditPost() {
  const [formData, setFormData] = useState({ title: '', content: '', tags: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to edit a post');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
      return;
    }

    axios.get(`http://localhost:9000/api/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setFormData({ title: res.data.title, content: res.data.content, tags: res.data.tags || '' }))
      .catch(err => {
        if (err.response?.status === 404) {
          setError('Post not found');
        } else if (err.response?.status === 401 || err.response?.status === 403) {
          setError('You are not authorized to edit this post');
          setTimeout(() => navigate('/'), 2000); // Redirect to home after 2 seconds
        } else {
          setError('An error occurred while fetching the post');
        }
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:9000/api/posts/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate('/');
    } catch (error) {
      if (error.response?.status === 403) {
        setError('You are not authorized to edit this post');
      } else if (error.response?.status === 401) {
        setError('Please log in to edit this post');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(error.response?.data?.error || 'An error occurred while updating the post');
      }
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Content"
          className="w-full p-2 mb-4 border rounded h-40 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags (e.g., tech, food, news)"
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Update Post
        </button>
      </div>
    </div>
  );
}

export default EditPost;