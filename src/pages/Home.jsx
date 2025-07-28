import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';


function Home() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Fetch posts from backend API
    axios.get('http://localhost:9000/api/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  // Filter posts based on selected category
  const filteredPosts = filter === 'all' ? posts : posts.filter(post => post.tags === filter);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
   

    {/* Header with Carousel */}
    <div className="bg-white shadow-md">
  <div className="container mx-auto px-4 py-4">
    <Carousel
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      interval={3000}
      className="rounded-md overflow-hidden"
    >
      {[
        {
          src: 'https://source.unsplash.com/1600x900/?technology,ai',
          caption: 'Artificial Intelligence Advances',
        },
        {
          src: 'https://source.unsplash.com/1600x900/?programming,coding',
          caption: 'Coding and Development',
        },
        {
          src: 'https://source.unsplash.com/1600x900/?laptop,developer',
          caption: 'Developer Workspace',
        },
      ].map(({ src, caption }, index) => (
        <div
          key={index}
          className="relative h-[40vh] w-full"  /* <-- Added fixed responsive height and full width here */
        >
          {/* Image fills full height and width of parent div */}
          <img
            src={src}
            alt={`Tech ${index + 1}`}
            className="h-full w-full object-cover" /* <-- Ensures image covers container without distortion */
          />

          {/* Dark semi-transparent overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>

          {/* Centered text overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-white text-2xl md:text-4xl font-semibold drop-shadow-lg text-center px-4">
              {caption}
            </h2>
          </div>
        </div>
      ))}
    </Carousel>
  </div>
</div>



      {/* Filter Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center space-x-4">
          {['all', 'tech', 'food', 'news'].map(cat => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setFilter(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Section */}
      <div className="container mx-auto px-4 py-6">
        {filteredPosts.length === 0 ? (
          <p className="text-center text-gray-600">No posts found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map(post => (
                <div
                  key={post._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={post.image || 'https://avatar.iran.liara.run/public/boy'}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {post.tags || 'Uncategorized'}
                    </span>
                    <Link to={`/post/${post._id}`} className="block mt-2">
                      <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 mt-2 line-clamp-3">{post.content}</p>
                    <div className="flex items-center mt-4">
                      <img
                        src={post.author?.avatar || 'https://avatar.iran.liara.run/public/boy'}
                        alt={post.author?.username || 'Author'}
                        className="w-10 h-10 rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-700">
                        {post.author?.username || 'Anonymous'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Us */}
          <div>
            <h2 className="text-xl font-bold mb-4">About Us</h2>
            <p className="text-gray-300">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus quisquam minus quo illo
              numquam vel incidunt pariatur hic commodi expedita tempora praesentium at iure fugiat ea,
              quam laborum aperiam veritatis.
            </p>
            <div className="flex space-x-4 mt-4">
              {['facebook', 'instagram', 'twitter', 'linkedin'].map(social => (
                <a
                  key={social}
                  href="#"
                  className="text-gray-300 hover:text-white transition"
                >
                  <i className={`bx bxl-${social} text-2xl`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-bold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-bold mb-4">Contact Info</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <i className="bx bxs-map text-2xl mr-2"></i>
                <span className="text-gray-300">
                  6444 London street <br /> Brighton PA 33445 <br /> UK
                </span>
              </li>
              <li className="flex items-start">
                <i className="bx bx-envelope text-2xl mr-2"></i>
                <a
                  href="mailto:codemyhobby9@gmail.com"
                  className="text-gray-300 hover:text-white transition"
                >
                  codemyhobby9@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;