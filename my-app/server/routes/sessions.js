import express from 'express';
import db from '../database/db.js';

const router = express.Router();

router.post('/start-session', (req, res) => {
  const { roomId, userId, userName } = req.body;

  if (!roomId || !userId || !userName) {
    return res.status(400).json({ error: 'Room ID, User ID, and User Name are required' });
  }

  db.get(
    'SELECT * FROM study_sessions WHERE room_id = ? AND user_id = ? AND is_active = 1',
    [roomId, userId],
    (err, existingSession) => {
      if (err) {
        console.error('Error checking active session:', err);
        return res.status(500).json({ error: 'Failed to check active session' });
      }

      if (existingSession) {
        return res.status(400).json({ error: 'You already have an active study session' });
      }

      const startTime = new Date().toISOString();

      db.run(
        'INSERT INTO study_sessions (room_id, user_id, user_name, start_time, is_active) VALUES (?, ?, ?, ?, 1)',
        [roomId, userId, userName, startTime],
        function(err) {
          if (err) {
            console.error('Error starting session:', err);
            return res.status(500).json({ error: 'Failed to start session' });
          }

          res.json({
            success: true,
            sessionId: this.lastID,
            startTime
          });
        }
      );
    }
  );
});

router.post('/end-session', (req, res) => {
  const { roomId, userId } = req.body;

  if (!roomId || !userId) {
    return res.status(400).json({ error: 'Room ID and User ID are required' });
  }

  db.get(
    'SELECT * FROM study_sessions WHERE room_id = ? AND user_id = ? AND is_active = 1',
    [roomId, userId],
    (err, session) => {
      if (err) {
        console.error('Error finding session:', err);
        return res.status(500).json({ error: 'Failed to find session' });
      }

      if (!session) {
        return res.status(404).json({ error: 'No active session found' });
      }

      const endTime = new Date().toISOString();
      const startTime = new Date(session.start_time);
      const durationSeconds = Math.floor((new Date(endTime) - startTime) / 1000);

      db.run(
        'UPDATE study_sessions SET end_time = ?, duration_seconds = ?, is_active = 0 WHERE id = ?',
        [endTime, durationSeconds, session.id],
        (err) => {
          if (err) {
            console.error('Error ending session:', err);
            return res.status(500).json({ error: 'Failed to end session' });
          }

          res.json({
            success: true,
            sessionId: session.id,
            durationSeconds
          });
        }
      );
    }
  );
});

router.get('/:roomId/leaderboard', (req, res) => {
  const { roomId } = req.params;

  db.all(
    `SELECT 
      user_id,
      user_name,
      SUM(CASE 
        WHEN is_active = 1 THEN (strftime('%s', 'now') - strftime('%s', start_time))
        ELSE duration_seconds 
      END) as total_seconds,
      MAX(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as is_studying
    FROM study_sessions 
    WHERE room_id = ?
    GROUP BY user_id, user_name
    ORDER BY total_seconds DESC`,
    [roomId],
    (err, rows) => {
      if (err) {
        console.error('Error fetching leaderboard:', err);
        return res.status(500).json({ error: 'Failed to fetch leaderboard' });
      }

      res.json(rows || []);
    }
  );
});

router.get('/:roomId/active-session/:userId', (req, res) => {
  const { roomId, userId } = req.params;

  db.get(
    'SELECT * FROM study_sessions WHERE room_id = ? AND user_id = ? AND is_active = 1',
    [roomId, userId],
    (err, session) => {
      if (err) {
        console.error('Error fetching active session:', err);
        return res.status(500).json({ error: 'Failed to fetch active session' });
      }

      res.json(session || null);
    }
  );
});

export default router;
