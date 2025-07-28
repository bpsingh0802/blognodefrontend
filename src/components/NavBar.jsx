import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleStartWriting = () => {
    if (!token) {
      navigate('/login');
    } else {
      navigate('/create-post');
    }
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          Code <span className="text-yellow-300">MyHobby</span>
        </Link>
        <div className="flex items-center space-x-4">
          {token ? (
            <>
              <button
                onClick={handleStartWriting}
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-200 transition"
              >
                Start Writing
              </button>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-200 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-gray-200 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white hover:text-gray-200 transition"
              >
                Register
              </Link>

              
            </>

            
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;