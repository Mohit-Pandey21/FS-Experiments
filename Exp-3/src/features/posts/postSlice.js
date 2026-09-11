import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  post: "",
  platform: "LinkedIn",
  image: null,
  posts: [],
};

const postSlice = createSlice({
  name: "posts",
  initialState,

  reducers: {
    setPost: (state, action) => {
      state.post = action.payload;
    },

    setPlatform: (state, action) => {
      state.platform = action.payload;
    },

    setImage: (state, action) => {
      state.image = action.payload;
    },

    addPost: (state, action) => {
      state.posts.push(action.payload);

      // Clear composer after publishing
      state.post = "";
      state.image = null;
    },

    deletePost: (state, action) => {
      state.posts = state.posts.filter(
        (post) => post.id !== action.payload
      );
    },

    updatePost: (state, action) => {
      const index = state.posts.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index].content = action.payload.content;
      }
    },
  },
});

export const {
  setPost,
  setPlatform,
  setImage,
  addPost,
  deletePost,
  updatePost,
} = postSlice.actions;

export default postSlice.reducer;