import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            navigate('/');
            return;
        }

        // Verify token and get user data
        fetch('http://localhost:5000/api/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setUser(data.user);
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
        .finally(() => {
            setLoading(false);
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
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
        <div className="relative h-screen">
            <Background />
            <div className="absolute inset-0 flex flex-col">
                {/* Navigation Bar */}
                <nav className="border border-white/20 rounded-4xl mx-auto mt-8 z-[70] h-[10vh] w-[90vw] flex items-center text-[rgb(245,245,245)] backdrop-blur-xl"
                    style={{
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(31,41,55,0.8) 100%)',
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 30px rgba(6, 182, 212, 0.1)"
                    }}>
                    <a className="ml-10 text-3xl bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                        STOODIUS ︱ <span className="italic font-light">Study With Friends</span>
                    </a>
                    <div className="ml-auto mr-6 flex items-center gap-4">
                        <span className="text-cyan-200">Welcome, {user?.fullName}!</span>
                        <button 
                            onClick={handleLogout}
                            className="rounded-full p-3 px-6 border border-white/20 bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-400 hover:to-red-500 transition-all duration-300">
                            Logout
                        </button>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center px-8">
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(31,41,55,0.6) 100%)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)"
                    }}
                    className="border border-white/10 rounded-3xl p-12 max-w-4xl w-full text-center">
                        <h1 className="text-5xl font-light mb-6 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                            Welcome to Your Dashboard
                        </h1>
                        <div className="text-gray-300 text-xl space-y-4 mt-8">
                            <p>Hello <span className="text-cyan-400 font-semibold">{user?.fullName}</span>!</p>
                            <p>You are successfully logged in to Stoodius.</p>
                            <p className="text-gray-400 text-lg mt-6">Email: {user?.email}</p>
                        </div>
                        
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <button 
                                onClick={() => navigate('/rooms')}
                                className="border border-cyan-400/30 rounded-xl p-6 hover:border-cyan-400/60 transition-all hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer hover:scale-105 transform duration-200 bg-transparent text-left">
                                <h3 className="text-xl text-cyan-400 mb-2">Study Rooms</h3>
                                <p className="text-gray-400 text-sm">Create or join study rooms</p>
                                <p className="text-cyan-300 text-xs mt-3">Click to enter →</p>
                            </button>
                            <div className="border border-cyan-400/30 rounded-xl p-6 hover:border-cyan-400/60 transition-all hover:shadow-lg hover:shadow-cyan-500/20 opacity-50">
                                <h3 className="text-xl text-cyan-400 mb-2">Pomodoro Timer</h3>
                                <p className="text-gray-400 text-sm">Boost your productivity</p>
                                <p className="text-gray-500 text-xs mt-3">Coming soon</p>
                            </div>
                            <div className="border border-cyan-400/30 rounded-xl p-6 hover:border-cyan-400/60 transition-all hover:shadow-lg hover:shadow-cyan-500/20 opacity-50">
                                <h3 className="text-xl text-cyan-400 mb-2">Shared Notes</h3>
                                <p className="text-gray-400 text-sm">Access your study materials</p>
                                <p className="text-gray-500 text-xs mt-3">Coming soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
