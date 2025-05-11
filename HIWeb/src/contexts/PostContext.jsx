import React, { createContext, useState, useEffect, useContext } from 'react';

const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // For MVP, we'll use localStorage for post persistence
  useEffect(() => {
    const storedPosts = localStorage.getItem('hiPosts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      // Seed with some example posts for the MVP
      const initialPosts = generateSamplePosts();
      localStorage.setItem('hiPosts', JSON.stringify(initialPosts));
      setPosts(initialPosts);
    }
    setLoading(false);
  }, []);

  const createPost = (postData) => {
    const newPost = {
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      pointsOfView: [],
      ...postData
    };

    const updatedPosts = [newPost, ...posts];
    localStorage.setItem('hiPosts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
    return newPost;
  };

  const addPointOfView = (postId, userId, identity, content) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newPOV = {
          id: `pov-${Date.now()}`,
          userId,
          identity,
          content,
          createdAt: new Date().toISOString()
        };
        return {
          ...post,
          pointsOfView: [newPOV, ...post.pointsOfView]
        };
      }
      return post;
    });

    localStorage.setItem('hiPosts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const addSolution = (postId, userId, identity, content) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newSolution = {
          id: `solution-${Date.now()}`,
          userId,
          identity,
          content,
          createdAt: new Date().toISOString()
        };
        return {
          ...post,
          solutions: post.solutions ? [newSolution, ...post.solutions] : [newSolution]
        };
      }
      return post;
    });

    localStorage.setItem('hiPosts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const likePost = (postId, userId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        // Track user likes in a real app; for MVP we just increment
        return {
          ...post,
          likes: post.likes + 1
        };
      }
      return post;
    });

    localStorage.setItem('hiPosts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const getUserPosts = (userId) => {
    return posts.filter(post => post.userId === userId);
  };

  const getUserInteractions = (userId) => {
    return posts.filter(post => 
      post.pointsOfView.some(pov => pov.userId === userId) ||
      (post.solutions && post.solutions.some(solution => solution.userId === userId))
    );
  };

  const filterPosts = (type) => {
    if (!type || type === 'all') {
      return posts;
    }
    return posts.filter(post => post.type === type);
  };

  const value = {
    posts,
    loading,
    createPost,
    addPointOfView,
    addSolution,
    likePost,
    getUserPosts,
    getUserInteractions,
    filterPosts
  };

  return (
    <PostContext.Provider value={value}>
      {!loading && children}
    </PostContext.Provider>
  );
};

function generateSamplePosts() {
  return [
    {
      id: 'post-1',
      type: 'ideaSnap',
      userId: 'sample-user-1',
      identity: 'FutureThinker',
      content: 'A platform that connects idle resources with those who need them, creating a true sharing economy that optimizes resource usage.',
      industry: 'Technology',
      createdAt: '2025-05-10T12:00:00Z',
      likes: 15,
      pointsOfView: [
        {
          id: 'pov-1',
          userId: 'sample-user-2',
          identity: 'InnovationMind',
          content: 'This could revolutionize how we think about ownership versus access in our economy!',
          createdAt: '2025-05-10T12:30:00Z'
        }
      ]
    },
    {
      id: 'post-2',
      type: 'marketGap',
      userId: 'sample-user-3',
      identity: 'MarketDisruptor',
      content: 'There\'s no effective way for small businesses to access AI tools without technical expertise or huge budgets.',
      industry: 'Artificial Intelligence',
      createdAt: '2025-05-09T14:00:00Z',
      likes: 24,
      pointsOfView: [],
      solutions: [
        {
          id: 'solution-1',
          userId: 'sample-user-4',
          identity: 'AIBuilder',
          content: 'A no-code platform with pre-built AI templates for common small business needs could solve this.',
          createdAt: '2025-05-09T16:45:00Z'
        }
      ]
    },
    {
      id: 'post-3',
      type: 'thought',
      thoughtType: 'whatIf',
      userId: 'sample-user-5',
      identity: 'DeepQuestioner',
      content: 'What if we had crowd-sourced cities, where infrastructure and services were determined directly by resident voting?',
      createdAt: '2025-05-08T09:15:00Z',
      likes: 37,
      pointsOfView: [
        {
          id: 'pov-2',
          userId: 'sample-user-6',
          identity: 'UrbanPlanner',
          content: 'This could lead to more responsive city services but might create inequalities between neighborhoods based on digital participation rates.',
          createdAt: '2025-05-08T10:30:00Z'
        }
      ]
    },
    {
      id: 'post-4',
      type: 'thought',
      thoughtType: 'whyNot',
      userId: 'sample-user-7',
      identity: 'CareerInnovator',
      content: 'Why not replace resume screening with 5-minute idea tests that actually show someone\'s creativity and problem-solving ability?',
      industry: 'Human Resources',
      createdAt: '2025-05-07T17:20:00Z',
      likes: 42,
      pointsOfView: []
    },
    {
      id: 'post-5',
      type: 'thought',
      thoughtType: 'observation',
      userId: 'sample-user-8',
      identity: 'PatternSpotter',
      content: 'The most successful education platforms aren\'t focusing on content delivery but on creating accountability and community.',
      industry: 'Education',
      createdAt: '2025-05-06T11:10:00Z',
      likes: 29,
      pointsOfView: []
    }
  ];
}

export default PostContext;