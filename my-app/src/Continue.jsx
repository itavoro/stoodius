import { useState, useEffect } from 'react';

function SignInForm (props) {
    if (!props.isVisible) return null;
    
    return (
        <div style={{
            opacity: props.isFadingIn ? '1' : '0',
            transition: 'opacity 0.3s ease-out',
            transform: 'translate(-50%, -50%)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
        className="bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col w-[600px] gap-4 p-8 rounded-2xl absolute top-1/2 left-1/2 z-[60] border border-gray-700/30 cursor-auto">
            <div className="text-center mb-1">
                <h2 className="text-2xl font-light text-white mb-1">Welcome Back</h2>
                <p className="text-gray-400 text-sm">Sign in to your Stoodius account</p>
            </div>
            <div className="space-y-3">
                <div className="relative">
                    <input 
                        className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-xl border border-gray-600/30 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200 backdrop-blur-sm" 
                        type="email" 
                        placeholder="Email address"
                    />
                </div>
                <div className="relative">
                    <input 
                        className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-xl border border-gray-600/30 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200 backdrop-blur-sm" 
                        type="password" 
                        placeholder="Password"
                    />
                </div>
            </div>
            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-medium px-4 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 mt-3">
                Sign In
            </button>
            <div className="text-center mt-3">
                <a href="#" className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors duration-200 block mb-2">
                    Forgot your password?
                </a>
                <button 
                    onClick={props.onSwitchToSignUp}
                    className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors duration-200 bg-transparent border-none cursor-pointer">
                    Don't have an account? Sign up
                </button>
            </div>
        </div>
    )
}

function SignUpForm (props) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Success - redirect or show success message
                console.log('User created successfully:', data);
                // You might want to redirect to dashboard or auto-login
            } else {
                // Handle error response
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!props.isVisible) return null;
    
    return (
        <div style={{
            opacity: props.isFadingIn ? '1' : '0',
            transition: 'opacity 0.3s ease-out',
            transform: 'translate(-50%, -50%)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
        className="bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col w-[600px] gap-4 p-8 rounded-2xl absolute top-1/2 left-1/2 z-[60] border border-gray-700/30 cursor-auto">
            <div className="text-center mb-1">
                <h2 className="text-2xl font-light text-white mb-1">Join Stoodius</h2>
                <p className="text-gray-400 text-sm">Create your account to get started</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                    <input 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-xl border border-gray-600/30 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200 backdrop-blur-sm" 
                        type="email" 
                        placeholder="Email address"
                        required
                    />
                </div>
                <div className="relative">
                    <input 
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-xl border border-gray-600/30 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200 backdrop-blur-sm" 
                        type="password" 
                        placeholder="Password"
                        required
                    />
                </div>
                <div className="relative">
                    <input 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-xl border border-gray-600/30 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200 backdrop-blur-sm" 
                        type="password" 
                        placeholder="Confirm password"
                        required
                    />
                </div>
                {error && (
                    <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-500/30 rounded-lg px-3 py-2">
                        {error}
                    </div>
                )}
            </form>
            <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-medium px-4 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 mt-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
            <div className="text-center mt-3">
                <p className="text-gray-400 text-xs mb-1">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
                <button 
                    onClick={props.onSwitchToSignIn}
                    className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors duration-200 bg-transparent border-none cursor-pointer">
                    Already have an account? Sign in
                </button>
            </div>
        </div>
    )
}

function AuthChoice (props) {
    if (!props.isVisible) return null;
    
    return (
        <div style={{
            opacity: props.isFadingIn ? '1' : '0',
            transition: 'opacity 0.3s ease-out',
            transform: 'translate(-50%, -50%)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
        className="bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col w-[500px] gap-6 p-8 rounded-2xl absolute top-1/2 left-1/2 z-[60] border border-gray-700/30 cursor-auto">
            <div className="text-center mb-2">
                <h2 className="text-3xl font-light text-white mb-2">Welcome to Stoodius</h2>
                <p className="text-gray-400 text-lg">How would you like to get started?</p>
            </div>
            <div className="space-y-4">
                <button 
                    onClick={() => props.onChoice('signup')}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-medium px-6 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 text-lg">
                    Create New Account
                </button>
                <button 
                    onClick={() => props.onChoice('signin')}
                    className="w-full bg-gray-800/50 hover:bg-gray-700/50 text-white font-medium px-6 py-4 rounded-xl border border-gray-600/30 hover:border-cyan-400/50 transition-all duration-200 transform hover:scale-105 text-lg">
                    Sign In to Existing Account
                </button>
            </div>
        </div>
    )
}

function Background (props) {
    const [coordinates, setCoordinates] = useState({x: 0, y: 0})
    const [isHovered, setIsHovered] = useState(false)

    function getCoordinates (background) {
        setCoordinates({x: background.clientX, y: background.clientY});
        setIsHovered(true)
    }

    return (
        <>
            <div 
            onClick={props.showLogin}
            onMouseMove={getCoordinates}
            className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-[rgb(244,229,200)] flex justify-center items-center relative cursor-none overflow-hidden"
            style={{
                opacity: props.backgroundFade ? 1 : 0,
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>
                {props.isIntroVisible && <div className="z-10 text-center px-8 relative">
                    <h1 id='intro' className="text-7xl font-thin tracking-wider mb-4 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent animate-pulse"
                        style={{
                            opacity: props.isIntroFading ? '0' : (props.introFade ? '1' : '0'),
                            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                            textShadow: '0 0 30px rgba(6, 182, 212, 0.5), 0 0 60px rgba(6, 182, 212, 0.3)',
                            filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.8))',
                            transform: props.introFade ? 'scale(1)' : 'scale(0.95)',
                        }}>
                        Click Anywhere to Start
                    </h1>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent blur-3xl -z-10 animate-pulse"
                        style={{
                            opacity: props.introFade ? '0.6' : '0',
                            transition: 'opacity 1s ease-in-out',
                        }}>
                    </div>
                    <p className="text-gray-300 text-lg font-light tracking-wide opacity-80"
                        style={{
                            opacity: props.isIntroFading ? '0' : (props.introFade ? '1' : '0'),
                            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
                            transform: props.introFade ? 'translateY(0)' : 'translateY(10px)',
                        }}>
                        Begin your study journey
                    </p>
                </div>}
                {isHovered && <div className="blur-xl z-0 pointer-events-none absolute w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-70"
                     style={{
                        left: coordinates.x - 40,
                        top: coordinates.y - 40,
                        transition: 'all 0.1s ease-out'
                     }}>
                </div>}
                {props.children}
            </div>
        </>
    )
}

export default function Continue () {
    const [isIntroFading, setIsIntroFading] = useState(false)
    const [isIntroVisible, setIsIntroVisible] = useState(true)
    
    const [isAuthChoiceVisible, setIsAuthChoiceVisible] = useState(false)
    const [isAuthChoiceFadingIn, setIsAuthChoiceFadingIn] = useState(false)
    
    const [isSignInVisible, setIsSignInVisible] = useState(false)
    const [isSignInFadingIn, setIsSignInFadingIn] = useState(false)
    
    const [isSignUpVisible, setIsSignUpVisible] = useState(false)
    const [isSignUpFadingIn, setIsSignUpFadingIn] = useState(false)
    
    const [backgroundFade, setBackgroundFade] = useState(false)
    const [introFade, setIntroFade] = useState(false)
    
    useEffect(() => {
        document.body.style.background = 'black';
        
        setTimeout(() => {setBackgroundFade(true)}, 1700)
        setTimeout(() => {setIntroFade(true)}, 2200)

        const handleSignUpTrigger = () => {
            showSignUpDirectly();
        };

        const handleSignInTrigger = () => {
            showSignInDirectly();
        };

        window.addEventListener('triggerSignUp', handleSignUpTrigger);
        window.addEventListener('triggerSignIn', handleSignInTrigger);

        return () => {
            window.removeEventListener('triggerSignUp', handleSignUpTrigger);
            window.removeEventListener('triggerSignIn', handleSignInTrigger);
        };
    }, [])

    function clickDiv () {
        setIsIntroFading(true)
        setTimeout(() => {
            setIsIntroVisible(false);
            setIsAuthChoiceVisible(true);
            setTimeout(() => {
                setIsAuthChoiceFadingIn(true);
            }, 10);
        }, 150)
    }

    function showSignUpDirectly() {
        setIsAuthChoiceFadingIn(false);
        setIsSignInFadingIn(false);
        
        if (isIntroVisible) {
            setIsIntroFading(true);
            setTimeout(() => {
                setIsIntroVisible(false);
                setIsAuthChoiceVisible(false);
                setIsSignInVisible(false);
                setIsSignUpVisible(true);
                setTimeout(() => {
                    setIsSignUpFadingIn(true);
                }, 10);
            }, 150);
        } else {
            setTimeout(() => {
                setIsIntroVisible(false);
                setIsAuthChoiceVisible(false);
                setIsSignInVisible(false);
                setIsSignUpVisible(true);
                setTimeout(() => {
                    setIsSignUpFadingIn(true);
                }, 10);
            }, 150);
        }
    }

    function showSignInDirectly() {
        setIsAuthChoiceFadingIn(false);
        setIsSignUpFadingIn(false);
        
        if (isIntroVisible) {
            setIsIntroFading(true);
            setTimeout(() => {
                setIsIntroVisible(false);
                setIsAuthChoiceVisible(false);
                setIsSignUpVisible(false);
                setIsSignInVisible(true);
                setTimeout(() => {
                    setIsSignInFadingIn(true);
                }, 10);
            }, 150);
        } else {
            setTimeout(() => {
                setIsIntroVisible(false);
                setIsAuthChoiceVisible(false);
                setIsSignUpVisible(false);
                setIsSignInVisible(true);
                setTimeout(() => {
                    setIsSignInFadingIn(true);
                }, 10);
            }, 150);
        }
    }

    function handleAuthChoice(choice) {
        setIsAuthChoiceFadingIn(false);
        setTimeout(() => {
            setIsIntroVisible(false);
            setIsAuthChoiceVisible(false);
            if (choice === 'signin') {
                setIsSignInVisible(true);
                setTimeout(() => {
                    setIsSignInFadingIn(true);
                }, 10);
            } else {
                setIsSignUpVisible(true);
                setTimeout(() => {
                    setIsSignUpFadingIn(true);
                }, 10);
            }
        }, 150);
    }

    function switchToSignUp() {
        setIsSignInFadingIn(false);
        setTimeout(() => {
            setIsIntroVisible(false);
            setIsSignInVisible(false);
            setIsSignUpVisible(true);
            setTimeout(() => {
                setIsSignUpFadingIn(true);
            }, 10);
        }, 150);
    }

    function switchToSignIn() {
        setIsSignUpFadingIn(false);
        setTimeout(() => {
            setIsIntroVisible(false);
            setIsSignUpVisible(false);
            setIsSignInVisible(true);
            setTimeout(() => {
                setIsSignInFadingIn(true);
            }, 10);
        }, 150);
    }

    return (
        <Background 
            showLogin={clickDiv}
            isIntroFading={isIntroFading}
            isIntroVisible={isIntroVisible}
            backgroundFade={backgroundFade}
            introFade={introFade}
        >
            <AuthChoice 
                isVisible={isAuthChoiceVisible}
                isFadingIn={isAuthChoiceFadingIn}
                onChoice={handleAuthChoice}
            />
            <SignInForm 
                isVisible={isSignInVisible}
                isFadingIn={isSignInFadingIn}
                onSwitchToSignUp={switchToSignUp}
            />
            <SignUpForm 
                isVisible={isSignUpVisible}
                isFadingIn={isSignUpFadingIn}
                onSwitchToSignIn={switchToSignIn}
            />
        </Background>
    )
}