import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../App.css";

import {
  setPost,
  setPlatform,
  setImage,
  addPost,
  deletePost,
  updatePost,
} from "../features/posts/postSlice";

import {
  selectPost,
  selectPlatform,
  selectImage,
  selectPosts,
} from "../features/posts/selectors";

import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { ChevronsUpDown, Image, Smile, LogOut } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { validateToken, logout } from "../lib/auth";
import ThemeToggle from "../components/ThemeToggle";

const LIMITS = {
  LinkedIn: 3000,
  X: 280,
  Instagram: 2200,
};

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const post = useSelector(selectPost);
  const platform = useSelector(selectPlatform);
  const image = useSelector(selectImage);
  const posts = useSelector(selectPosts);

  const platforms = [
    {
      name: "LinkedIn",
      icon: <FaLinkedin className="text-[#0A66C2] text-xl" />,
    },
    {
      name: "X",
      icon: <FaXTwitter className="text-gray-900 dark:text-white text-xl" />,
    },
    {
      name: "Instagram",
      icon: <FaInstagram className="text-pink-500 text-xl" />,
    },
  ];

  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0]);
  const [open, setOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const fileInputRef = useRef(null);

  const limit = LIMITS[platform];
  const remaining = limit - post.length;

  const isValid = post.trim().length > 0 && post.length <= limit;

  const { payload } = validateToken();
  const userRole = payload?.role || 'viewer';
  const userName = payload?.name || 'User';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Role check
    if (userRole === 'viewer') {
      setErrorMsg('Viewers are not allowed to publish posts.');
      return;
    }

    // 1. Token Check
    const authCheck = validateToken();
    if (!authCheck.valid) {
      setErrorMsg(authCheck.error);
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    // 2. Required Fields Check
    if (!isValid || !platform || post.trim() === '') {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    const headers = {
      Authorization: `Bearer ${authCheck.token}`,
    };
    console.log("Mocking API Request with headers:", headers);

    dispatch(
      addPost({
        id: Date.now(),
        content: post,
        platform,
        image,
        userId: authCheck.payload.userId
      })
    );

    alert("🎉 Post Published Successfully!");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(setImage(URL.createObjectURL(file)));
    }
  };

  const onEmojiClick = (emojiData) => {
    dispatch(setPost(post + emojiData.emoji));
    setShowEmojiPicker(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#080510] flex items-center justify-center px-4 py-12 relative overflow-hidden transition-colors duration-300">

      {/* Header (Logout / User info) */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <div className="text-gray-900 dark:text-white font-bold text-xl flex items-center gap-2">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
           Lumina Workspace
        </div>
        <div className="flex items-center gap-4">
           <div className="text-sm text-gray-700 dark:text-gray-300 text-right">
              <p className="font-semibold text-gray-900 dark:text-white">{userName}</p>
              <p className="capitalize text-indigo-500 dark:text-indigo-400">{userRole}</p>
           </div>
           <ThemeToggle />
           <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
             <LogOut size={18} />
           </button>
        </div>
      </div>

      {/* Background Blur */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-16 -translate-x-1/2 w-[650px] h-[280px] bg-indigo-500/10 dark:bg-indigo-700/25 rounded-full blur-[120px]" />
        <div className="absolute right-0 bottom-0 w-[350px] h-[250px] bg-purple-500/10 dark:bg-purple-700/20 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[430px] flex flex-col gap-6 mt-16">
        {errorMsg && (
            <div className="w-full bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm p-4 rounded-2xl backdrop-blur-xl transition-colors">
              {errorMsg}
            </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="w-full bg-white/90 dark:bg-[#181625]/90 border border-gray-200 dark:border-white/10 rounded-3xl px-8 py-10 backdrop-blur-xl shadow-xl dark:shadow-2xl transition-colors"
        >
          {/* Heading */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center">
            Create Post
          </h1>

          <p className="text-center text-gray-500 dark:text-gray-400 mt-2">
            Share your thoughts with everyone
          </p>

          {/* Post */}
          <div className="mt-8">
            <textarea
              rows={6}
              value={post}
              onChange={(e) => dispatch(setPost(e.target.value))}
              placeholder="What's on your mind?"
              className="w-full bg-gray-50 dark:bg-[#252239] border border-gray-200 dark:border-white/10 rounded-3xl p-5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none resize-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="mt-4 flex justify-center items-center gap-4 w-full bg-gray-50 dark:bg-[#252239] border border-gray-200 dark:border-white/10 rounded-2xl py-3 transition-colors">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="w-10 h-10 flex items-center justify-center rounded-xl
               text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
               hover:bg-indigo-500/10 dark:hover:bg-indigo-600/20
               border border-transparent
               hover:border-indigo-500/40
               transition-all duration-200"
            >
              <Image size={18} />
            </button>

            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-10 h-10 flex items-center justify-center rounded-xl
               text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
               hover:bg-indigo-500/10 dark:hover:bg-indigo-600/20
               border border-transparent
               hover:border-indigo-500/40
               transition-all duration-200"
            >
              <Smile size={18} />
            </button>
          </div>
          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Image Preview */}
          {image && (
            <div className="mt-4 relative">
              <img
                src={image}
                alt="Preview"
                className="w-full max-h-60 object-cover rounded-2xl border border-gray-200 dark:border-white/10"
              />
              <button 
                type="button"
                onClick={() => dispatch(setImage(null))}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2"
              >
                ✕
              </button>
            </div>
          )}
          {showEmojiPicker && (
            <div className="mt-4 flex justify-center">
              <EmojiPicker onEmojiClick={onEmojiClick} theme="auto" />
            </div>
          )}

          {/* Platform */}
          <div className="mt-6 relative">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">Platform</p>

            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="w-full h-14 rounded-full bg-gray-50 dark:bg-[#252239] border border-gray-200 dark:border-white/10 px-5 flex items-center justify-between hover:border-indigo-500 transition-colors"
            >
              <div className="flex items-center gap-3">
                {selectedPlatform.icon}
                <span className="text-gray-900 dark:text-white">{selectedPlatform.name}</span>
              </div>

              <ChevronsUpDown
                size={18}
                className={`text-gray-500 dark:text-gray-400 transition ${open ? "rotate-180" : ""
                  }`}
              />
            </button>

            {open && (
              <div className="absolute top-16 left-0 w-full bg-white dark:bg-[#1C1A2D] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl z-50 transition-colors">
                {platforms.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setSelectedPlatform(item);
                      dispatch(setPlatform(item.name));
                      setOpen(false);
                    }}
                    className={`w-full px-5 py-4 flex items-center gap-3 transition hover:bg-indigo-100 dark:hover:bg-indigo-600 ${selectedPlatform.name === item.name
                      ? "bg-indigo-50 dark:bg-indigo-600"
                      : ""
                      }`}
                  >
                    {item.icon}

                    <span className="text-gray-900 dark:text-white">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Validation */}
          <div className="flex justify-between mt-6">

            <p
              className={`text-sm ${remaining < 0
                ? "text-red-500 dark:text-red-400"
                : remaining < 20
                  ? "text-yellow-500 dark:text-yellow-400"
                  : "text-green-500 dark:text-green-400"
                }`}
            >
              {remaining < 0
                ? "Character limit exceeded"
                : "Ready to publish"}
            </p>

            <p
              className={`text-sm ${remaining < 0 ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
                }`}
            >
              {post.length} / {limit}
            </p>

          </div>

          {/* Publish */}
          <button
            disabled={!isValid}
            type="submit"
            className={`mt-8 w-full h-14 rounded-full text-white font-medium text-lg transition-all duration-300 shadow-lg dark:shadow-none ${isValid
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 dark:from-indigo-600 dark:to-purple-600 hover:scale-[1.02]"
              : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
              }`}
          >
            Publish Post
          </button>
        </form>

        {/* Published Posts */}
        <div className="w-full bg-white/90 dark:bg-[#181625]/90 border border-gray-200 dark:border-white/10 rounded-3xl px-8 py-8 backdrop-blur-xl shadow-xl dark:shadow-2xl transition-colors">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Published Posts
          </h2>

          {posts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No posts have been published yet.
            </p>
          ) : (
             <div className="space-y-4">
               {posts.map((item) => (
                 <div
                   key={item.id}
                   className="bg-gray-50 dark:bg-[#252239] border border-gray-200 dark:border-white/10 rounded-2xl p-5 transition-colors"
                 >
                   <div className="flex justify-between items-start mb-2">
                     <p className="text-indigo-600 dark:text-indigo-400 font-semibold">
                       {item.platform}
                     </p>
                     {userRole === 'admin' && (
                       <div className="flex gap-2">
                         {editingId === item.id ? (
                           <>
                             <button
                               onClick={() => {
                                 dispatch(updatePost({ id: item.id, content: editContent }));
                                 setEditingId(null);
                               }}
                               className="text-green-600 hover:text-green-800 bg-green-100 dark:bg-green-500/10 hover:bg-green-200 dark:hover:bg-green-500/20 px-3 py-1 rounded-lg text-sm font-medium transition-all"
                             >
                               Save
                             </button>
                             <button
                               onClick={() => setEditingId(null)}
                               className="text-gray-600 hover:text-gray-800 bg-gray-100 dark:bg-gray-500/10 hover:bg-gray-200 dark:hover:bg-gray-500/20 px-3 py-1 rounded-lg text-sm font-medium transition-all"
                             >
                               Cancel
                             </button>
                           </>
                         ) : (
                           <>
                             <button
                               onClick={() => {
                                 setEditingId(item.id);
                                 setEditContent(item.content);
                               }}
                               className="text-blue-500 hover:text-blue-700 bg-blue-100 dark:bg-blue-500/10 hover:bg-blue-200 dark:hover:bg-blue-500/20 px-3 py-1 rounded-lg text-sm font-medium transition-all"
                             >
                               Edit
                             </button>
                             <button
                               onClick={() => dispatch(deletePost(item.id))}
                               className="text-red-500 hover:text-red-700 bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 px-3 py-1 rounded-lg text-sm font-medium transition-all"
                             >
                               Delete
                             </button>
                           </>
                         )}
                       </div>
                     )}
                   </div>

                   {editingId === item.id ? (
                     <textarea
                       value={editContent}
                       onChange={(e) => setEditContent(e.target.value)}
                       className="w-full mt-2 bg-white dark:bg-[#1C1A2D] border border-gray-300 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white outline-none focus:border-indigo-500 transition-colors resize-none"
                       rows={3}
                     />
                   ) : (
                     <p className="text-gray-800 dark:text-white whitespace-pre-wrap text-sm leading-relaxed mt-2">
                       {item.content}
                     </p>
                   )}

                   {item.image && (
                     <img
                       src={item.image}
                       alt="Post"
                       className="mt-4 rounded-xl w-full max-h-48 object-cover border border-gray-200 dark:border-white/10"
                     />
                   )}
                 </div>
               ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
