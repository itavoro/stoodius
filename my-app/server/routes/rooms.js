import express from 'express';
import db from '../database/db.js';

const router = express.Router();

router.post('/create', (req, res) => {
  const { name, description, userId, userName } = req.body;

  if (!name || !userId || !userName) {
    return res.status(400).json({ 
      success: false, 
      message: 'Room name, user ID, and user name are required' 
    });
  }

  db.run(
    'INSERT INTO study_rooms (name, description, created_by) VALUES (?, ?, ?)',
    [name, description || '', userId],
    function(err) {
      if (err) {
        console.error('Error creating room:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Error creating room' 
        });
      }

      const roomId = this.lastID;

      db.run(
        'INSERT INTO room_members (room_id, user_id, role) VALUES (?, ?, ?)',
        [roomId, userId, 'owner'],
        (err) => {
          if (err) {
            console.error('Error adding owner to room:', err);
            return res.status(500).json({ 
              success: false, 
              message: 'Error adding owner to room' 
            });
          }

          res.json({ 
            success: true, 
            roomId, 
            message: 'Room created successfully' 
          });
        }
      );
    }
  );
});

router.get('/list', (req, res) => {
  const userId = req.query.userId;

  const query = `
    SELECT 
      sr.id,
      sr.name,
      sr.description,
      sr.created_by,
      sr.created_at,
      u.full_name as creator_name,
      COUNT(DISTINCT rm.user_id) as member_count
    FROM study_rooms sr
    LEFT JOIN users u ON sr.created_by = u.id
    LEFT JOIN room_members rm ON sr.id = rm.room_id
    WHERE sr.is_public = 1
    GROUP BY sr.id
    ORDER BY sr.created_at DESC
  `;

  db.all(query, [], (err, rooms) => {
    if (err) {
      console.error('Error fetching rooms:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching rooms' 
      });
    }

    if (userId) {
      const checkMembershipQuery = 'SELECT room_id FROM room_members WHERE user_id = ?';
      db.all(checkMembershipQuery, [userId], (err, memberships) => {
        if (err) {
          console.error('Error checking memberships:', err);
          return res.json({ success: true, rooms });
        }

        const memberRoomIds = memberships.map(m => m.room_id);
        const roomsWithMembership = rooms.map(room => ({
          ...room,
          isMember: memberRoomIds.includes(room.id)
        }));

        res.json({ success: true, rooms: roomsWithMembership });
      });
    } else {
      res.json({ success: true, rooms });
    }
  });
});

router.post('/join', (req, res) => {
  const { roomId, userId } = req.body;

  if (!roomId || !userId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Room ID and user ID are required' 
    });
  }

  db.get(
    'SELECT * FROM room_members WHERE room_id = ? AND user_id = ?', 
    [roomId, userId], 
    (err, existing) => {
      if (err) {
        console.error('Error checking membership:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Error checking membership' 
        });
      }

      if (existing) {
        return res.json({ 
          success: true, 
          message: 'Already a member of this room' 
        });
      }

      db.run(
        'INSERT INTO room_members (room_id, user_id) VALUES (?, ?)',
        [roomId, userId],
        function(err) {
          if (err) {
            console.error('Error joining room:', err);
            return res.status(500).json({ 
              success: false, 
              message: 'Error joining room' 
            });
          }

          res.json({ 
            success: true, 
            message: 'Joined room successfully' 
          });
        }
      );
    }
  );
});

router.get('/:roomId', (req, res) => {
  const { roomId } = req.params;

  const query = `
    SELECT 
      sr.id,
      sr.name,
      sr.description,
      sr.created_by,
      sr.created_at,
      u.full_name as creator_name
    FROM study_rooms sr
    LEFT JOIN users u ON sr.created_by = u.id
    WHERE sr.id = ?
  `;

  db.get(query, [roomId], (err, room) => {
    if (err) {
      console.error('Error fetching room:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching room' 
      });
    }

    if (!room) {
      return res.status(404).json({ 
        success: false, 
        message: 'Room not found' 
      });
    }

    res.json({ success: true, room });
  });
});

router.get('/:roomId/members', (req, res) => {
  const { roomId } = req.params;

  const query = `
    SELECT 
      u.id,
      u.full_name,
      rm.role,
      rm.joined_at
    FROM room_members rm
    JOIN users u ON rm.user_id = u.id
    WHERE rm.room_id = ?
    ORDER BY rm.joined_at ASC
  `;

  db.all(query, [roomId], (err, members) => {
    if (err) {
      console.error('Error fetching members:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching members' 
      });
    }

    res.json({ success: true, members });
  });
});

router.get('/:roomId/messages', (req, res) => {
  const { roomId } = req.params;
  const limit = req.query.limit || 100;

  const query = `
    SELECT 
      m.id,
      m.room_id,
      m.user_id,
      m.user_name,
      m.content,
      m.created_at
    FROM messages m
    WHERE m.room_id = ?
    ORDER BY m.created_at DESC
    LIMIT ?
  `;

  db.all(query, [roomId, limit], (err, messages) => {
    if (err) {
      console.error('Error fetching messages:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching messages' 
      });
    }

    res.json({ 
      success: true, 
      messages: messages.reverse() 
    });
  });
});

export default router;
