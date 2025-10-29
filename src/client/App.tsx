import { useEffect, useState } from 'react';
import { GameContainer } from './components/GameContainer';

export const App = () => {
  const [postId, setPostId] = useState<string>('');

  useEffect(() => {
    // Get postId from URL or context
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('postId') || 'default-post';
    setPostId(id);
  }, []);

  if (!postId) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '24px',
        color: '#22c55e'
      }}>
        Loading...
      </div>
    );
  }

  return <GameContainer postId={postId} />;
};
