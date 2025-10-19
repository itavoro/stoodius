import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';

let socket = null;

function Background() {
    return (
        <div className="flex flex-col h-screen relative overflow-hidden">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 flex-1"></div>
            <div className="bg-gradient-to-bl from-gray-900 via-black to-gray-800 flex-1"></div>
            <div className="bg-gradient-to-br from-gray-800 via-black to-gray-900 flex-1"></div>
            <div className="bg-gradient-to-bl from-gray-800 via-black to-gray-900 flex-1"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none"></div>
        </div>
    );
}

export default function Room() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [members, setMembers] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const [isStudying, setIsStudying] = useState(false);
    const [studyTime, setStudyTime] = useState(0);
    const [sessionId, setSessionId] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const timerIntervalRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        fetch('http://localhost:5000/api/auth/verify', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setUser(data.user);
                initializeRoom(data.user, token);
            } else {
                localStorage.removeItem('token');
                navigate('/');
            }
        })
        .catch(err => {
            console.error('Error verifying token:', err);
            localStorage.removeItem('token');
            navigate('/');
        });

        return () => {
            if (socket) {
                socket.emit('leave-room', { roomId });
                socket.disconnect();
                socket = null;
            }
        };
    }, [roomId, navigate]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const initializeRoom = async (userData, token) => {
        try {
            const [roomRes, messagesRes, membersRes, leaderboardRes, activeSessionRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/rooms/${roomId}`),
                axios.get(`http://localhost:5000/api/rooms/${roomId}/messages`),
                axios.get(`http://localhost:5000/api/rooms/${roomId}/members`),
                axios.get(`http://localhost:5000/api/sessions/${roomId}/leaderboard`),
                axios.get(`http://localhost:5000/api/sessions/${roomId}/active-session/${userData.id}`)
            ]);

            if (roomRes.data.success) setRoom(roomRes.data.room);
            if (messagesRes.data.success) setMessages(messagesRes.data.messages);
            if (membersRes.data.success) setMembers(membersRes.data.members);
            if (leaderboardRes.data) setLeaderboard(leaderboardRes.data);
            
            if (activeSessionRes.data) {
                setIsStudying(true);
                setSessionId(activeSessionRes.data.id);
                const elapsed = Math.floor((Date.now() - new Date(activeSessionRes.data.start_time).getTime()) / 1000);
                setStudyTime(elapsed);
                startTimer();
            }

            connectSocket(token, userData);
        } catch (err) {
            console.error('Error initializing room:', err);
        } finally {
            setLoading(false);
        }
    };

    const connectSocket = (token, userData) => {
        socket = io('http://localhost:5000', {
            auth: { token }
        });

        socket.on('connect', () => {
            console.log('Connected to socket');
            setConnected(true);
            socket.emit('join-room', { roomId, userName: userData.fullName });
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket');
            setConnected(false);
        });

        socket.on('new-message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        socket.on('user-joined', ({ userName, onlineCount }) => {
            setMessages(prev => [...prev, {
                id: `system-${Date.now()}`,
                content: `${userName} joined the room`,
                user_name: 'System',
                created_at: new Date().toISOString(),
                isSystem: true
            }]);
        });

        socket.on('user-left', ({ userName, onlineCount }) => {
            setMessages(prev => [...prev, {
                id: `system-${Date.now()}`,
                content: `${userName} left the room`,
                user_name: 'System',
                created_at: new Date().toISOString(),
                isSystem: true
            }]);
        });

        socket.on('online-users', (users) => {
            setOnlineUsers(users);
        });

        socket.on('user-timer-update', () => {
            fetchLeaderboard();
        });

        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            setConnected(false);
        });
    };

    const fetchLeaderboard = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/sessions/${roomId}/leaderboard`);
            if (res.data) setLeaderboard(res.data);
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
        }
    };

    const startTimer = () => {
        if (timerIntervalRef.current) return;
        timerIntervalRef.current = setInterval(() => {
            setStudyTime(prev => prev + 1);
        }, 1000);
    };

    const stopTimer = () => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    };

    const toggleStudy = async () => {
        const token = localStorage.getItem('token');
        try {
            if (!isStudying) {
                const res = await axios.post('http://localhost:5000/api/sessions/start-session', {
                    roomId,
                    userId: user.id,
                    userName: user.fullName
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.data.success) {
                    setIsStudying(true);
                    setSessionId(res.data.sessionId);
                    setStudyTime(0);
                    startTimer();
                    socket.emit('timer-started', { roomId, userId: user.id, userName: user.fullName });
                }
            } else {
                const res = await axios.post('http://localhost:5000/api/sessions/end-session', {
                    roomId,
                    userId: user.id
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.data.success) {
                    setIsStudying(false);
                    setSessionId(null);
                    stopTimer();
                    socket.emit('timer-stopped', { 
                        roomId, 
                        userId: user.id, 
                        userName: user.fullName,
                        durationSeconds: studyTime 
                    });
                    fetchLeaderboard();
                }
            }
        } catch (err) {
            console.error('Error toggling study:', err);
        }
    };

    const sendMessage = () => {
        if (!input.trim() || !connected) return;

        socket.emit('send-message', {
            roomId,
            content: input.trim(),
            userName: user.fullName
        });

        setInput('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDuration = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="relative h-screen">
                <Background />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-2xl">Loading room...</div>
                </div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="relative h-screen">
                <Background />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-2xl">Room not found</div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-screen overflow-hidden">
            <Background />
            <div className="absolute inset-0 flex flex-col">
                <nav className="border border-white/20 rounded-4xl mx-auto mt-4 z-[70] h-[8vh] w-[95vw] flex items-center text-[rgb(245,245,245)] backdrop-blur-xl"
                    style={{
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(31,41,55,0.8) 100%)',
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)"
                    }}>
                    <a className="ml-6 text-2xl bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent cursor-pointer" onClick={() => navigate('/rooms')}>
                        ← Back to Rooms
                    </a>
                    <div className="ml-auto mr-6 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-sm text-gray-300">{onlineUsers.length} online</span>
                        </div>
                    </div>
                </nav>

                <div className="flex-1 flex overflow-hidden p-4 gap-4">
                    <div className="flex-1 flex flex-col border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(31,41,55,0.5) 100%)',
                        }}>
                        <div className="p-6 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl text-white">{room.name}</h2>
                                    {room.description && <p className="text-sm text-gray-400 mt-1">{room.description}</p>}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-white font-mono">{formatDuration(studyTime)}</div>
                                        <div className="text-xs text-gray-400">Your Study Time</div>
                                    </div>
                                    <button
                                        onClick={toggleStudy}
                                        className={`px-6 py-3 rounded-xl font-medium transition-all ${
                                            isStudying 
                                                ? 'bg-red-500 hover:bg-red-600 text-white' 
                                                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white'
                                        }`}>
                                        {isStudying ? '⏸ Stop Studying' : '▶ Start Studying'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`${msg.isSystem ? 'text-center' : ''}`}>
                                    {msg.isSystem ? (
                                        <div className="text-xs text-gray-500 italic">{msg.content}</div>
                                    ) : (
                                        <div className={`flex flex-col ${msg.user_id === user?.id ? 'items-end' : 'items-start'}`}>
                                            <div className="text-xs text-gray-400 mb-1">
                                                {msg.user_name} • {formatTime(msg.created_at)}
                                            </div>
                                            <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                                                msg.user_id === user?.id 
                                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                                                    : 'bg-gray-800 text-gray-100'
                                            }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-white/10">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={connected ? "Type a message..." : "Connecting..."}
                                    disabled={!connected}
                                    className="flex-1 bg-gray-800/50 text-white px-4 py-3 rounded-xl border border-gray-600/30 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 disabled:opacity-50"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!connected || !input.trim()}
                                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-80 flex flex-col gap-4">
                        <div className="border border-white/10 rounded-2xl backdrop-blur-xl p-6 overflow-y-auto"
                            style={{
                                background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(31,41,55,0.5) 100%)',
                            }}>
                            <h3 className="text-lg text-white mb-4 flex items-center gap-2">
                                🏆 Leaderboard
                            </h3>
                            <div className="space-y-3">
                                {leaderboard.length === 0 ? (
                                    <div className="text-center text-gray-400 text-sm py-4">
                                        No study sessions yet.<br/>Start studying to appear here!
                                    </div>
                                ) : (
                                    leaderboard.map((entry, index) => (
                                        <div key={entry.user_id} className={`flex items-center gap-3 p-3 rounded-lg ${
                                            entry.user_id === user?.id ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-gray-800/30'
                                        }`}>
                                            <div className={`text-lg font-bold ${
                                                index === 0 ? 'text-yellow-400' :
                                                index === 1 ? 'text-gray-300' :
                                                index === 2 ? 'text-orange-400' :
                                                'text-gray-500'
                                            }`}>
                                                #{index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm text-white font-medium flex items-center gap-2">
                                                    {entry.user_name}
                                                    {entry.is_studying === 1 && (
                                                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                                                            Studying
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-400 font-mono">
                                                    {formatDuration(Math.floor(entry.total_seconds))}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="border border-white/10 rounded-2xl backdrop-blur-xl p-6 overflow-y-auto"
                            style={{
                                background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(31,41,55,0.5) 100%)',
                            }}>
                            <h3 className="text-lg text-white mb-4">Members ({members.length})</h3>
                            <div className="space-y-3">
                                {members.map((member) => {
                                    const isOnline = onlineUsers.some(u => u.userId === member.id);
                                    return (
                                        <div key={member.id} className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                            <div className="flex-1">
                                                <div className="text-sm text-white">{member.full_name}</div>
                                                {member.role === 'owner' && (
                                                    <div className="text-xs text-cyan-400">Owner</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
