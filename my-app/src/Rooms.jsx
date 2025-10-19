import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

export default function Rooms() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

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
                fetchRooms(data.user.id);
            } else {
                localStorage.removeItem('token');
                navigate('/');
            }
        })
        .catch(err => {
            console.error('Error verifying token:', err);
            localStorage.removeItem('token');
            navigate('/');
        })
        .finally(() => setLoading(false));
    }, [navigate]);

    const fetchRooms = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/rooms/list?userId=${userId}`);
            if (res.data.success) {
                setRooms(res.data.rooms);
            }
        } catch (err) {
            console.error('Error fetching rooms:', err);
        }
    };

    const handleCreate = async () => {
        if (!name.trim()) {
            setError('Please enter a room name');
            return;
        }

        setCreating(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/rooms/create', {
                name: name.trim(),
                description: description.trim(),
                userId: user.id,
                userName: user.fullName
            });

            if (res.data.success) {
                setShowCreateModal(false);
                setName('');
                setDescription('');
                fetchRooms(user.id);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create room');
        } finally {
            setCreating(false);
        }
    };

    const handleJoin = async (roomId, isMember) => {
        if (!isMember) {
            try {
                await axios.post('http://localhost:5000/api/rooms/join', {
                    roomId,
                    userId: user.id
                });
            } catch (err) {
                console.error('Error joining room:', err);
            }
        }
        navigate(`/room/${roomId}`);
    };

    if (loading) {
        return (
            <div className="relative h-screen">
                <Background />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-2xl">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-screen overflow-hidden">
            <Background />
            <div className="absolute inset-0 flex flex-col">
                <nav className="border border-white/20 rounded-4xl mx-auto mt-8 z-[70] h-[10vh] w-[90vw] flex items-center text-[rgb(245,245,245)] backdrop-blur-xl"
                    style={{
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(31,41,55,0.8) 100%)',
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)"
                    }}>
                    <a className="ml-10 text-3xl bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent cursor-pointer" onClick={() => navigate('/dashboard')}>
                        STOODIUS
                    </a>
                    <div className="ml-auto mr-6 flex items-center gap-4">
                        <span className="text-cyan-200">{user?.fullName}</span>
                        <button onClick={() => navigate('/dashboard')} className="rounded-full p-3 px-6 border border-white/20 hover:bg-cyan-500/20 transition-all duration-300">
                            Dashboard
                        </button>
                    </div>
                </nav>

                <div className="flex-1 overflow-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-4xl font-light bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                                Study Rooms
                            </h1>
                            <button 
                                onClick={() => setShowCreateModal(true)}
                                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105">
                                + Create Room
                            </button>
                        </div>

                        {rooms.length === 0 ? (
                            <div className="text-center text-gray-400 mt-20">
                                <p className="text-xl">No study rooms yet</p>
                                <p className="text-sm mt-2">Create one to get started!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {rooms.map(room => (
                                    <div key={room.id} 
                                        className="border border-white/10 rounded-xl p-6 backdrop-blur-xl hover:border-cyan-400/50 transition-all cursor-pointer"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(31,41,55,0.5) 100%)',
                                        }}
                                        onClick={() => handleJoin(room.id, room.isMember)}>
                                        <h3 className="text-xl text-white mb-2">{room.name}</h3>
                                        <p className="text-sm text-gray-400 mb-4">{room.description || 'No description'}</p>
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>{room.member_count} member{room.member_count !== 1 ? 's' : ''}</span>
                                            <span className="text-cyan-400">{room.isMember ? 'Joined' : 'Click to join'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}>
                    <div 
                        className="border border-white/20 rounded-2xl p-8 w-full max-w-md backdrop-blur-xl"
                        style={{
                            background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(31,41,55,0.9) 100%)',
                        }}
                        onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl text-white mb-6">Create Study Room</h2>
                        
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm mb-4">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-300 text-sm block mb-2">Room Name *</label>
                                <input 
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Math Study Group"
                                    className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-xl border border-gray-600/30 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50"
                                    disabled={creating}
                                />
                            </div>
                            <div>
                                <label className="text-gray-300 text-sm block mb-2">Description (optional)</label>
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What are you studying?"
                                    rows={3}
                                    className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-xl border border-gray-600/30 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 resize-none"
                                    disabled={creating}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button 
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all"
                                disabled={creating}>
                                Cancel
                            </button>
                            <button 
                                onClick={handleCreate}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl transition-all disabled:opacity-50"
                                disabled={creating}>
                                {creating ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
