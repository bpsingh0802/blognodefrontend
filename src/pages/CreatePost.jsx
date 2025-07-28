import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [formData, setFormData] = useState({ title: '', content: '', tags: '', image: null, visibility: 'public' });
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('Please log in to create a post');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    // Fetch recent posts by the logged-in user
    setLoading(true);
    axios.get('http://localhost:9000/api/posts/my-posts', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setRecentPosts(res.data);
        setFetchFailed(res.data.length === 0);
      })
      .catch(err => {
        setFetchFailed(true);
        setError('Failed to fetch recent posts. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please log in to create a post');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('tags', formData.tags);
    data.append('visibility', formData.visibility);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await axios.post('http://localhost:9000/api/posts', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/');
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Please log in to create a post');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(error.response?.data?.error || 'An error occurred while creating the post');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-post/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:9000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentPosts(recentPosts.filter(post => post._id !== id));
      setFetchFailed(recentPosts.length === 1); // Update fetchFailed if no posts remain
    } catch (error) {
      setError(error.response?.data?.error || 'Error deleting post');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (id, currentVisibility) => {
    const newVisibility = currentVisibility === 'public' ? 'private' : 'public';
    setLoading(true);
    try {
      await axios.put(`http://localhost:9000/api/posts/${id}`, 
        { visibility: newVisibility },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecentPosts(recentPosts.map(post => 
        post._id === id ? { ...post, visibility: newVisibility } : post
      ));
    } catch (error) {
      setError(error.response?.data?.error || 'Error updating visibility');
    } finally {
      setLoading(false);
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
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Post</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          disabled={loading}
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your post content here..."
            className="w-full p-3 mb-4 border rounded-lg h-48 focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={loading}
          />
        </div>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags (e.g., tech, food, news)"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          disabled={loading}
        />
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Upload Image
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={loading}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
            disabled={loading}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </div>
        {showPreview && (
          <div className="border p-4 rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-2">{formData.title || 'Post Title'}</h2>
            <p className="text-gray-700">{formData.content || 'No content yet'}</p>
            {formData.image && (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className="mt-4 max-w-full h-auto rounded-lg"
              />
            )}
            <p className="text-sm text-gray-500 mt-2">Tags: {formData.tags || 'None'}</p>
            <p className="text-sm text-gray-500">Visibility: {formData.visibility}</p>
          </div>
        )}
      </div>

      {/* Recent Posts Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Recent Posts</h2>
        {loading && <p className="text-gray-600">Loading recent posts...</p>}
        {!loading && (fetchFailed || recentPosts.length === 0) ? (
          <p className="text-gray-600">No posts published yet</p>
        ) : (
          <div className="grid gap-6">
            {recentPosts
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
              .map(post => (
                <div key={post._id} className="border p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
                  <p className="text-gray-600 line-clamp-2">{post.content}</p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">Tags: {post.tags}</p>
                  <p className="text-sm text-gray-500">
                    Visibility: {post.visibility || 'public'}
                  </p>
                  {post.image && (
                    <img
                      src={`http://localhost:9000${post.image}`}
                      alt={post.title}
                      className="mt-3 max-w-xs h-auto rounded-lg"
                    />
                  )}
                  <div className="flex space-x-3 mt-3">
                    <button
                      onClick={() => handleEdit(post._id)}
                      className="bg-blue-500 text-white px-4 py-1.5 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                      disabled={loading}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleToggleVisibility(post._id, post.visibility || 'public')}
                      className="bg-green-500 text-white px-4 py-1.5 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                      disabled={loading}
                    >
                      {post.visibility === 'private' ? 'Make Public' : 'Make Private'}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePost;