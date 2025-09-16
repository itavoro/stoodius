import { useState, useEffect } from 'react';

function Login (props) {
    return (
        props.isLoginVisible && (<div style={{
            opacity: props.isLoginFadingIn ? '1' : '0',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'translate(-50%, -50%)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
        className="bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col w-96 gap-6 p-10 rounded-2xl absolute top-1/2 left-1/2 z-50 border border-gray-700/30 cursor-auto">
            <div className="text-center mb-2">
                <h2 className="text-2xl font-light text-white mb-2">Welcome Back</h2>
                <p className="text-gray-400 text-sm">Sign in to continue</p>
            </div>
            <div className="space-y-4">
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
            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-medium px-4 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 mt-4">
                Sign In
            </button>
            <div className="text-center mt-4">
                <a href="#" className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors duration-200">
                    Forgot your password?
                </a>
            </div>
        </div>
        )
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
                {props.isIntroVisible && <h1 id='intro' className="z-10 text-6xl font-light tracking-wide text-center px-8"
                    style={{
                        opacity: props.isIntroFading ? '0' : (props.introFade ? '1' : '0'),
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                    }}>
                        Click Anywhere to Start
                </h1>}
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
    const [isLoginFadingIn, setIsLoginFadingIn] = useState(false)
    const [isLoginVisible, setIsLoginVisible] = useState(false)
    
    // Initial page load animations - matching Welcome.jsx timing
    const [backgroundFade, setBackgroundFade] = useState(false)
    const [introFade, setIntroFade] = useState(false)
    
    useEffect(() => {
        // Set body background to black immediately
        document.body.style.background = 'black';
        
        // Staggered animations matching Welcome.jsx
        setTimeout(() => {setBackgroundFade(true)}, 1700)
        setTimeout(() => {setIntroFade(true)}, 2200)
    }, [])

    function clickDiv () {
        setIsIntroFading(true)
        setTimeout(() => 
            {
                setIsIntroVisible(false);
                setIsLoginVisible(true);
                setTimeout(() => {
                    setIsLoginFadingIn(true);
                }, 50);
            }
        ,400)
    }

    return (
        <Background 
            showLogin={clickDiv}
            isIntroFading={isIntroFading}
            isIntroVisible={isIntroVisible}
            backgroundFade={backgroundFade}
            introFade={introFade}
        >
            <Login 
                isLoginVisible={isLoginVisible}
                isLoginFadingIn={isLoginFadingIn}
            />
        </Background>
    )
}