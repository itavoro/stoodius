import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (!existsSync(__dirname)) {
  mkdirSync(__dirname, { recursive: true });
}

const dbPath = join(__dirname, 'stoodius.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        console.log('Users table is ready.');
      }
    });

    db.run(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `, (err) => {
      if (err) {
        console.error('Error creating index:', err.message);
      } else {
        console.log('Database indexes are ready.');
      }
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS study_rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_by INTEGER NOT NULL,
        is_public INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating study_rooms table:', err.message);
      } else {
        console.log('study_rooms table is ready.');
      }
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS room_members (
        room_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        role TEXT DEFAULT 'member',
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (room_id, user_id),
        FOREIGN KEY (room_id) REFERENCES study_rooms(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `, (err) => {
      if (err) {
        console.error('Error creating room_members table:', err.message);
      } else {
        console.log('room_members table is ready.');
      }
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        user_name TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES study_rooms(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `, (err) => {
      if (err) {
        console.error('Error creating messages table:', err.message);
      } else {
        console.log('messages table is ready.');
      }
    });

    db.run(`
      CREATE INDEX IF NOT EXISTS idx_messages_room ON messages(room_id)
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS study_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        user_name TEXT NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME,
        duration_seconds INTEGER,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES study_rooms(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `, (err) => {
      if (err) {
        console.error('Error creating study_sessions table:', err.message);
      } else {
        console.log('study_sessions table is ready.');
      }
    });

    db.run(`
      CREATE INDEX IF NOT EXISTS idx_study_sessions_room ON study_sessions(room_id)
    `);

    db.run(`
      CREATE INDEX IF NOT EXISTS idx_study_sessions_user ON study_sessions(user_id, room_id)
    `);
  });
}

export default db;
