import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';  // ✅ Fixed

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:9000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const decoded = jwtDecode(credential); // ✅ Fixed usage
      console.log('Google user:', decoded);

      const res = await axios.post('http://localhost:9000/api/auth/google-login', {
        token: credential,
      });

      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <GoogleOAuthProvider clientId="470339623106-pqejtojp4aqjntl9cmkq4k1lid0oeis5.apps.googleusercontent.com">
      <div className="max-w-md mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <div className="bg-white p-6 rounded shadow">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white p-2 rounded mb-4"
          >
            Login
          </button>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.error('Google Login Failed')}
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
