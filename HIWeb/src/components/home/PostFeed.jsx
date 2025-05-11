import React from 'react';
import PostCard from '../common/PostCard';
import './PostFeed.css';

const PostFeed = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="post-feed post-feed--empty">
        <div className="post-feed__empty-state">
          <h3>No posts to show</h3>
          <p>Be the first to share your ideas or check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="post-feed">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;