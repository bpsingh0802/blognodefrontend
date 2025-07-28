// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import axios from 'axios';

// function Post() {
//   const { id } = useParams();
//   const [post, setPost] = useState(null);
//   const [relatedPosts, setRelatedPosts] = useState([]);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch all posts and current post
//     Promise.all([
//       axios.get(`http://localhost:9000/api/posts/${id}`),
//       axios.get('http://localhost:9000/api/posts')
//     ])
//       .then(([postRes, allPostsRes]) => {
//         setPost(postRes.data);
//         setPosts(allPostsRes.data);
//         // Filter related posts (same tag, excluding current post)
//         const related = allPostsRes.data
//           .filter(p => p._id !== id && p.tags === postRes.data.tags)
//           .slice(0, 3);
//         setRelatedPosts(related);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error(err);
//         setLoading(false);
//       });
//   }, [id]);

//   // Find previous and next posts
//   const currentIndex = posts.findIndex(p => p._id === id);
//   const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
//   const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (!post) {
//     return (
//       <div className="container mx-auto px-4 py-12 text-center">
//         <h2 className="text-2xl font-bold text-gray-800">Post not found</h2>
//         <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       {/* Header */}
     

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-12">
//         <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//           <img
//             src={post.image || 'https://avatar.iran.liara.run/public/boy'}
//             alt={post.title}
//             className="w-full h-96 object-cover"
//           />
//           <div className="p-8">
//             <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded mb-4">
//               {post.tags || 'Uncategorized'}
//             </span>
//             <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
//             <div className="flex items-center mb-6">
//               <img
//                 src={post.author?.avatar || 'https://avatar.iran.liara.run/public/boy'}
//                 alt={post.author?.username || 'Author'}
//                 className="w-12 h-12 rounded-full mr-3"
//               />
//               <div>
//                 <p className="text-gray-700 font-medium">{post.author?.username || 'Anonymous'}</p>
//                 <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
//               </div>
//             </div>
//             <div className="prose prose-lg max-w-none text-gray-700 mb-8">
//               {post.content}
//             </div>

//             {/* Navigation Buttons */}
//             <div className="flex justify-between mt-8">
//               {prevPost ? (
//                 <Link
//                   to={`/post/${prevPost._id}`}
//                   className="flex items-center text-blue-600 hover:text-blue-800 transition"
//                 >
//                   <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//                   </svg>
//                   <span>Previous Post</span>
//                 </Link>
//               ) : (
//                 <div></div>
//               )}
//               {nextPost ? (
//                 <Link
//                   to={`/post/${nextPost._id}`}
//                   className="flex items-center text-blue-600 hover:text-blue-800 transition"
//                 >
//                   <span>Next Post</span>
//                   <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//                   </svg>
//                 </Link>
//               ) : (
//                 <div></div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Related Posts */}
//         {relatedPosts.length > 0 && (
//           <div className="mt-12">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Posts</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {relatedPosts.map(relatedPost => (
//                 <Link
//                   to={`/post/${relatedPost._id}`}
//                   key={relatedPost._id}
//                   className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
//                 >
//                   <img
//                     src={relatedPost.image || 'https://avatar.iran.liara.run/public/boy'}
//                     alt={relatedPost.title}
//                     className="w-full h-48 object-cover"
//                   />
//                   <div className="p-4">
//                     <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
//                       {relatedPost.tags || 'Uncategorized'}
//                     </span>
//                     <h3 className="text-lg font-semibold text-gray-800 mt-2 hover:text-blue-600 transition">
//                       {relatedPost.title}
//                     </h3>
//                     <p className="text-sm text-gray-500 mt-1">
//                       {new Date(relatedPost.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white py-12">
//         <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div>
//             <h2 className="text-xl font-bold mb-4">About Us</h2>
//             <p className="text-gray-300">
//               Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus quisquam minus quo illo
//               numquam vel incidunt pariatur hic commodi expedita tempora praesentium at iure fugiat ea,
//               quam laborum aperiam veritatis.
//             </p>
//             <div className="flex space-x-4 mt-4">
//               {['facebook', 'instagram', 'twitter', 'linkedin'].map(social => (
//                 <a
//                   key={social}
//                   href="#"
//                   className="text-gray-300 hover:text-white transition"
//                 >
//                   <i className={`bx bxl-${social} text-2xl`}></i>
//                 </a>
//               ))}
//             </div>
//           </div>
//           <div>
//             <h2 className="text-xl font-bold mb-4">Quick Links</h2>
//             <ul className="space-y-2">
//               <li>
//                 <Link to="/" className="text-gray-300 hover:text-white transition">
//                   Home
//                 </Link>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-300 hover:text-white transition">
//                   About
//                 </a>
//               </li>
//             </ul>
//           </div>
//           <div>
//             <h2 className="text-xl font-bold mb-4">Contact Info</h2>
//             <ul className="space-y-4">
//               <li className="flex items-start">
//                 <i className="bx bxs-map text-2xl mr-2"></i>
//                 <span className="text-gray-300">
//                   6444 London street <br /> Brighton PA 33445 <br /> UK
//                 </span>
//               </li>
//               <li className="flex items-start">
//                 <i className="bx bx-envelope text-2xl mr-2"></i>
//                 <a
//                   href="mailto:codemyhobby9@gmail.com"
//                   className="text-gray-300 hover:text-white transition"
//                 >
//                   codemyhobby9@gmail.com
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default Post;


import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0); // Client-side like counter

  useEffect(() => {
    // Fetch all posts and current post
    Promise.all([
      axios.get(`http://localhost:9000/api/posts/${id}`),
      axios.get('http://localhost:9000/api/posts')
    ])
      .then(([postRes, allPostsRes]) => {
        setPost(postRes.data);
        setPosts(allPostsRes.data);
        // Filter related posts (same tag, excluding current post)
        const related = allPostsRes.data
          .filter(p => p._id !== id && p.tags === postRes.data.tags)
          .slice(0, 3);
        setRelatedPosts(related);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // Handle like button click
  const handleLike = () => {
    setLikes(prev => prev + 1);
  };

  // Find previous and next posts
  const currentIndex = posts.findIndex(p => p._id === id);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center bg-gray-50">
        <h2 className="text-3xl font-bold text-gray-800">Post not found</h2>
        <Link to="/" className="text-blue-600 hover:underline text-lg mt-4 inline-block">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
    

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="relative">
            <img
              src={post.image || 'https://avatar.iran.liara.run/public/boy'}
              alt={post.title}
              className="w-full h-[28rem] object-cover"
            />
            <div className="absolute top-4 left-4 bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
              {post.tags || 'Uncategorized'}
            </div>
          </div>
          <div className="p-8 sm:p-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">{post.title}</h1>
            <div className="flex items-center mb-8">
              <img
                src={post.author?.avatar || 'https://avatar.iran.liara.run/public/boy'}
                alt={post.author?.username || 'Author'}
                className="w-14 h-14 rounded-full mr-4 border-2 border-gray-200"
              />
              <div>
                <p className="text-lg font-semibold text-gray-800">{post.author?.username || 'Anonymous'}</p>
                <p className="text-sm text-gray-500">
                  Published on {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 mb-10">
              {/* Assuming post.content contains markdown-like text with headings and paragraphs */}
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
            {/* Like Button */}
            <div className="flex items-center mb-8">
              <button
                onClick={handleLike}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
              </button>
            </div>
            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between mt-10 gap-4">
              {prevPost ? (
                <Link
                  to={`/post/${prevPost._id}`}
                  className="flex items-center bg-gray-100 text-blue-600 px-6 py-3 rounded-full hover:bg-gray-200 transition font-medium"
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous: {prevPost.title}</span>
                </Link>
              ) : (
                <div></div>
              )}
              {nextPost ? (
                <Link
                  to={`/post/${nextPost._id}`}
                  className="flex items-center bg-gray-100 text-blue-600 px-6 py-3 rounded-full hover:bg-gray-200 transition font-medium"
                >
                  <span>Next: {nextPost.title}</span>
                  <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <Link
                  to={`/post/${relatedPost._id}`}
                  key={relatedPost._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  <img
                    src={relatedPost.image || 'https://avatar.iran.liara.run/public/boy'}
                    alt={relatedPost.title}
                    className="w-full h-52 object-cover"
                  />
                  <div className="p-6">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      {relatedPost.tags || 'Uncategorized'}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(relatedPost.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">About Us</h2>
            <p className="text-gray-300 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus quisquam minus quo illo
              numquam vel incidunt pariatur hic commodi expedita tempora praesentium at iure fugiat ea,
              quam laborum aperiam veritatis.
            </p>
            <div className="flex space-x-6 mt-6">
              {['facebook', 'instagram', 'twitter', 'linkedin'].map(social => (
                <a
                  key={social}
                  href="#"
                  className="text-gray-300 hover:text-white transition transform hover:scale-110"
                >
                  <i className={`bx bxl-${social} text-2xl`}></i>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition font-medium">
                  Home
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition font-medium">
                  About
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Info</h2>
            <ul className="space-y-6">
              <li className="flex items-start">
                <i className="bx bxs-map text-2xl mr-3 mt-1"></i>
                <span className="text-gray-300">
                  6444 London street <br /> Brighton PA 33445 <br /> UK
                </span>
              </li>
              <li className="flex items-start">
                <i className="bx bx-envelope text-2xl mr-3 mt-1"></i>
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

export default Post;