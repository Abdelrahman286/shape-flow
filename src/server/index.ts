import express from 'express';
import { InitResponse, IncrementResponse, DecrementResponse } from '../shared/types/api';
import { redis, reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

router.get<{ postId: string }, InitResponse | { status: string; message: string }>(
  '/api/init',
  async (_req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      console.error('API Init Error: postId not found in devvit context');
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }

    try {
      const [count, username] = await Promise.all([
        redis.get('count'),
        reddit.getCurrentUsername(),
      ]);

      res.json({
        type: 'init',
        postId: postId,
        count: count ? parseInt(count) : 0,
        username: username ?? 'anonymous',
      });
    } catch (error) {
      console.error(`API Init Error for post ${postId}:`, error);
      let errorMessage = 'Unknown error during initialization';
      if (error instanceof Error) {
        errorMessage = `Initialization failed: ${error.message}`;
      }
      res.status(400).json({ status: 'error', message: errorMessage });
    }
  }
);

router.post<{ postId: string }, IncrementResponse | { status: string; message: string }, unknown>(
  '/api/increment',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    res.json({
      count: await redis.incrBy('count', 1),
      postId,
      type: 'increment',
    });
  }
);

router.post<{ postId: string }, DecrementResponse | { status: string; message: string }, unknown>(
  '/api/decrement',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    res.json({
      count: await redis.incrBy('count', -1),
      postId,
      type: 'decrement',
    });
  }
);

router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post('/internal/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

// Puzzle game API endpoints
router.get('/api/user-profile', async (_req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    const user = username ? await reddit.getUserByUsername(username) : null;
    
    res.json({
      username: username ?? 'Player',
      avatar: user?.iconUrl ?? '/default-avatar.png',
      karma: user?.totalKarma ?? 0,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.json({
      username: 'Player',
      avatar: '/default-avatar.png',
      karma: 0,
    });
  }
});

router.post('/api/save-progress', async (req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ status: 'error', message: 'User not authenticated' });
      return;
    }

    const progressData = req.body;
    const key = `player_progress_${username}`;
    
    await redis.set(key, JSON.stringify(progressData));
    
    res.json({ status: 'success' });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ status: 'error', message: 'Failed to save progress' });
  }
});

router.get('/api/load-progress', async (_req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.json(null);
      return;
    }

    const key = `player_progress_${username}`;
    const data = await redis.get(key);
    
    if (data) {
      const progress = JSON.parse(data);
      
      // Special case: unlock all levels for Ab_dev1
      if (username === 'Ab_dev1') {
        progress.highestLevel = 20; // Unlock all 20 levels
        progress.currentLevel = Math.max(progress.currentLevel || 1, 1);
      }
      
      res.json(progress);
    } else {
      // Special case: if no data exists for Ab_dev1, give them all levels unlocked
      if (username === 'Ab_dev1') {
        res.json({
          userId: username,
          currentLevel: 1,
          highestLevel: 20,
          totalCompletions: 0,
          bestTime: 0,
          soundEnabled: true,
        });
      } else {
        res.json(null);
      }
    }
  } catch (error) {
    console.error('Error loading progress:', error);
    res.json(null);
  }
});

router.post('/api/update-leaderboard', async (req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ status: 'error', message: 'User not authenticated' });
      return;
    }

    const { score, time } = req.body;
    const user = await reddit.getUserByUsername(username);
    
    const leaderboardKey = 'leaderboard_scores';
    const entryKey = `leaderboard_entry_${username}`;
    
    // Store entry details
    const entry = {
      username,
      avatar: user?.iconUrl ?? '/default-avatar.png',
      score,
      completionTime: time,
    };
    
    await redis.set(entryKey, JSON.stringify(entry));
    await redis.zAdd(leaderboardKey, { member: username, score });
    
    res.json({ status: 'success' });
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update leaderboard' });
  }
});

router.get('/api/leaderboard', async (req, res): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const leaderboardKey = 'leaderboard_scores';
    
    // Get top scores
    const topScores = await redis.zRange(leaderboardKey, 0, limit - 1, { reverse: true, by: 'rank' });
    
    const entries = await Promise.all(
      topScores.map(async (item, index) => {
        const entryKey = `leaderboard_entry_${item.member}`;
        const data = await redis.get(entryKey);
        
        if (data) {
          const entry = JSON.parse(data);
          return {
            rank: index + 1,
            ...entry,
          };
        }
        
        return {
          rank: index + 1,
          username: item.member,
          avatar: '/default-avatar.png',
          score: item.score,
          completionTime: 0,
        };
      })
    );
    
    res.json(entries);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.json([]);
  }
});

router.post('/api/share-achievement', async (req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ status: 'error', message: 'User not authenticated' });
      return;
    }

    const { level, time } = req.body;
    const subredditName = context.subredditName;
    
    if (!subredditName) {
      res.status(400).json({ status: 'error', message: 'Subreddit not found' });
      return;
    }

    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    await reddit.submitPost({
      subredditName,
      title: `🎉 I just completed Level ${level} in the SVG Puzzle Game!`,
      text: `I completed Level ${level} in ${timeStr}! Can you beat my time?`,
    });
    
    res.json({ status: 'success', message: 'Achievement shared!' });
  } catch (error) {
    console.error('Error sharing achievement:', error);
    res.status(500).json({ status: 'error', message: 'Failed to share achievement' });
  }
});

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
