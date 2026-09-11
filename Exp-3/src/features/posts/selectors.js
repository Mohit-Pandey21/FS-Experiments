import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectPost = (state) => state.posts.post;

export const selectPlatform = (state) => state.posts.platform;

export const selectImage = (state) => state.posts.image;

export const selectPosts = (state) => state.posts.posts;


// Memoized selector
export const selectPostsByPlatform = createSelector(
  [selectPosts, selectPlatform],
  (posts, platform) =>
    posts.filter((post) => post.platform === platform)
);