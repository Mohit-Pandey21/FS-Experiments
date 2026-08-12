import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";

import {
  setPost,
  setPlatform,
  setImage,
  addPost,
} from "./features/posts/postSlice";

import {
  selectPost,
  selectPlatform,
  selectImage,
  selectPosts,
} from "./features/posts/selectors";

import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { ChevronsUpDown, Image, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const LIMITS = {
  LinkedIn: 3000,
  X: 280,
  Instagram: 2200,
};

const App = () => {
  const dispatch = useDispatch();

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
      icon: <FaXTwitter className="text-white text-xl" />,
    },
    {
      name: "Instagram",
      icon: <FaInstagram className="text-pink-500 text-xl" />,
    },
  ];

  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0]);
  const [open, setOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef(null);

  const limit = LIMITS[platform];
  const remaining = limit - post.length;

  const isValid =
    post.trim().length > 0 &&
    post.length <= limit;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValid) return;

    dispatch(
      addPost({
        id: Date.now(),
        content: post,
        platform,
        image,
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
    <div className="min-h-screen bg-[#080510] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background Blur */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-16 -translate-x-1/2 w-[650px] h-[280px] bg-indigo-700/25 rounded-full blur-[120px]" />
        <div className="absolute right-0 bottom-0 w-[350px] h-[250px] bg-purple-700/20 rounded-full blur-[100px]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[430px] bg-[#181625]/90 border border-white/10 rounded-3xl px-8 py-10 backdrop-blur-xl shadow-2xl"
      >
        {/* Heading */}
        <h1 className="text-4xl font-bold text-white text-center">
          Create Post
        </h1>

        <p className="text-center text-gray-400 mt-2">
          Share your thoughts with everyone
        </p>

        {/* Post */}
        <div className="mt-8">
          <textarea
            rows={6}
            value={post}
            onChange={(e) => dispatch(setPost(e.target.value))}
            placeholder="What's on your mind?"
            className="w-full bg-[#252239] border border-white/10 rounded-3xl p-5 text-white placeholder:text-gray-400 outline-none resize-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="mt-4 flex justify-center items-center gap-4 w-full bg-[#252239] border border-white/10 rounded-2xl py-3">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="w-10 h-10 flex items-center justify-center rounded-xl
             text-gray-400 hover:text-white
             hover:bg-indigo-600/20
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
             text-gray-400 hover:text-white
             hover:bg-indigo-600/20
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
          <div className="mt-4">
            <img
              src={image}
              alt="Preview"
              className="w-full max-h-60 object-cover rounded-2xl border border-white/10"
            />
          </div>
        )}
        {showEmojiPicker && (
          <div className="mt-4 flex justify-center">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}

        {/* Platform */}
        <div className="mt-6 relative">
          <p className="text-gray-300 text-sm mb-2">Platform</p>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-full h-14 rounded-full bg-[#252239] border border-white/10 px-5 flex items-center justify-between hover:border-indigo-500 transition"
          >
            <div className="flex items-center gap-3">
              {selectedPlatform.icon}
              <span className="text-white">{selectedPlatform.name}</span>
            </div>

            <ChevronsUpDown
              size={18}
              className={`text-gray-400 transition ${open ? "rotate-180" : ""
                }`}
            />
          </button>

          {open && (
            <div className="absolute top-16 left-0 w-full bg-[#1C1A2D] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50">

              {platforms.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setSelectedPlatform(item);
                    dispatch(setPlatform(item.name));
                    setOpen(false);
                  }}
                  className={`w-full px-5 py-4 flex items-center gap-3 transition hover:bg-indigo-600 ${selectedPlatform.name === item.name
                    ? "bg-indigo-600"
                    : ""
                    }`}
                >
                  {item.icon}

                  <span className="text-white">
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
              ? "text-red-400"
              : remaining < 20
                ? "text-yellow-400"
                : "text-green-400"
              }`}
          >
            {remaining < 0
              ? "Character limit exceeded"
              : "Ready to publish"}
          </p>

          <p
            className={`text-sm ${remaining < 0 ? "text-red-400" : "text-gray-400"
              }`}
          >
            {post.length} / {limit}
          </p>

        </div>

        {/* Publish */}
        <button
          disabled={!isValid}
          type="submit"
          className={`mt-8 w-full h-14 rounded-full text-white font-medium text-lg transition-all duration-300 ${isValid
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02]"
            : "bg-gray-700 cursor-not-allowed"
            }`}
        >
          Publish Post
        </button>
        {/* Published Posts */}
<div className="mt-8">
  <h2 className="text-2xl font-bold text-white mb-4">
    Published Posts
  </h2>

  {posts.length === 0 ? (
    <p className="text-gray-400 text-center">
      No posts published yet.
    </p>
  ) : (
    posts.map((item) => (
      <div
        key={item.id}
        className="bg-[#252239] border border-white/10 rounded-2xl p-4 mb-4"
      >
        <p className="text-indigo-400 font-semibold">
          {item.platform}
        </p>

        <p className="text-white mt-2 whitespace-pre-wrap">
          {item.content}
        </p>

        {item.image && (
          <img
            src={item.image}
            alt="Post"
            className="mt-4 rounded-xl w-full max-h-60 object-cover"
          />
        )}
      </div>
    ))
  )}
</div>
      </form>
    </div>
  );
};

export default App;