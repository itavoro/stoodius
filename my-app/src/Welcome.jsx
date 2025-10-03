import { useState, useEffect } from 'react';

function Background (props) {
    return (
        <div className="flex flex-col h-screen relative overflow-hidden">
            <div id="bg1" className="bg-gradient-to-br from-gray-900 via-black to-gray-800 flex-1 w-0"></div>
            <div id="bg2" className="bg-gradient-to-bl from-gray-900 via-black to-gray-800 flex-1 w-0 ml-auto"></div>
            <div id="bg3" className="bg-gradient-to-br from-gray-800 via-black to-gray-900 flex-1 w-0"></div>
            <div id="bg4" className="bg-gradient-to-bl from-gray-800 via-black to-gray-900 flex-1 w-0 ml-auto"></div>
            <div id="bg5" className="bg-gradient-to-br from-gray-900 via-black to-gray-800 flex-1 w-0"></div>
            <div id="bg1" className="bg-gradient-to-bl from-gray-900 via-black to-gray-800 flex-1 w-0 ml-auto"></div>
            <div id="bg2" className="bg-gradient-to-br from-gray-800 via-black to-gray-900 flex-1 w-0"></div>
            <div id="bg3" className="bg-gradient-to-bl from-gray-800 via-black to-gray-900 flex-1 w-0 ml-auto"></div>
            <div id="bg4" className="bg-gradient-to-br from-gray-900 via-black to-gray-800 flex-1 w-0"></div>
            <div id="bg5" className="bg-gradient-to-bl from-gray-900 via-black to-gray-800 flex-1 w-0 ml-auto"></div>
            <div id="bg1" className="bg-gradient-to-br from-gray-800 via-black to-gray-900 flex-1 w-0"></div>
            <div id="bg2" className="bg-gradient-to-bl from-gray-800 via-black to-gray-900 flex-1 w-0 ml-auto"></div>
            <div id="bg3" className="bg-gradient-to-br from-gray-900 via-black to-gray-800 flex-1 w-0"></div>
            <div id="bg4" className="bg-gradient-to-bl from-gray-900 via-black to-gray-800 flex-1 w-0 ml-auto"></div>
            <div id="bg5" className="bg-gradient-to-br from-gray-800 via-black to-gray-900 flex-1 w-0"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none"></div>
            {props.children}
        </div>
    )
}

function Navigation (props) {
    return (
        <nav className="border border-white/20 rounded-4xl fixed top-1/20 left-1/2 z-[70] h-[10vh] w-[200vh] flex items-center text-[rgb(245,245,245)] -translate-x-1/2 backdrop-blur-xl"
        style={{fontWeight: 'bold',
                opacity: props.containerFade ? 1 : 0,
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(31,41,55,0.8) 100%)',
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 30px rgba(6, 182, 212, 0.1)"
        }}>
            <a 
            className="ml-10 text-3xl bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                STOODIUS ︱ <span className="italic font-light">Study With Friends</span>
            </a>
            <button 
                onClick={props.onFeaturesClick}
                className="rounded-full mr-6 ml-auto p-3 px-6 border border-white/20 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 hover:border-cyan-400/50 hover:text-cyan-100 transition-all duration-300 backdrop-blur-sm">
                Features
            </button>
            <button 
                onClick={props.onSignInClick}
                className="rounded-full mr-6 p-3 border border-white/20 px-6 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 hover:border-cyan-400/50 hover:text-cyan-100 transition-all duration-300 backdrop-blur-sm">
                Sign In
            </button>
            <button 
                onClick={props.onSignUpClick}
                className="rounded-full mr-6 p-3 border border-white/20 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105">
                Sign Up
            </button>
        </nav>
    )
}

function Card (props) {
    return (
        <div style={{
            opacity: props.containerFade ? 1 : 0,
            transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(31,41,55,0.6) 100%)',
            backdropFilter: 'blur(20px)',
            boxShadow: props.focused 
                ? "0 30px 60px -12px rgba(6, 182, 212, 0.4), 0 0 0 2px rgba(6, 182, 212, 0.3), 0 0 40px rgba(6, 182, 212, 0.2)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 20px rgba(6, 182, 212, 0.1)",
            transform: props.focused ? 'scale(1.08)' : 'scale(1)',
            zIndex: props.focused ? 50 : 'auto'
        }}
            className={`border text-center h-[440px] px-10 w-[400px] text-white rounded-3xl transition-all duration-500 transform hover:scale-105 ${
                props.focused 
                    ? 'border-cyan-400/60 shadow-2xl shadow-cyan-500/20' 
                    : 'border-white/10 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/10'
            }`}>
            <h2 className="block mt-8 text-2xl font-light bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">{props.title}</h2>
            <ul className="text-left mt-6 list-none text-lg space-y-3 text-gray-300">
                {props.listItems.map((item, index) => (
                    <li key={index} className="flex items-start">
                        <span className="text-cyan-400 mr-3 mt-1">•</span>
                        <span className="leading-relaxed">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function ArrowButton (props) {
    if (props.appear) {
        return (
                <button 
                style={{opacity: props.fade ? 1 : 0,
                        transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(31,41,55,0.6) 100%)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 20px rgba(6, 182, 212, 0.2)"
                }}
                onClick = {() => window.scrollTo({top: 1000, behavior: 'smooth' })}
                className="text-5xl text-white rounded-full border border-white/20 h-17 w-50 flex items-center justify-center hover:border-cyan-400/50 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 hover:text-cyan-100 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 transform hover:scale-110">
                    ↓
                </button>
            )
    }
  
}

export default function Welcome () {
    const [containerFade, setContainerFade] = useState(false)
    const [navFade, setNavFade] = useState(false)
    const [buttonFade, setButtonFade] = useState(false)
    const [cardsFocused, setCardsFocused] = useState(false)
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    setTimeout(() => {setNavFade(true); document.body.style.background = 'black'}, 1700)
    setTimeout(() => {setContainerFade(true)}, 2200)
    setTimeout(() => {setButtonFade(true)}, 2700)

    const handleSignUpClick = () => {
        window.scrollTo({top: window.innerHeight, behavior: 'smooth' });
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('triggerSignUp'));
        }, 100);
    }

    const handleSignInClick = () => {
        window.scrollTo({top: window.innerHeight, behavior: 'smooth' });
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('triggerSignIn'));
        }, 100);
    }

    const handleFeaturesClick = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        
        setCardsFocused(true);
        setTimeout(() => {
            setCardsFocused(false);
        }, 3000);
    }

    return (
        <div className="relative flex flex-col justify-center">
            <Navigation 
                containerFade={navFade}
                onSignUpClick={handleSignUpClick}
                onSignInClick={handleSignInClick}
                onFeaturesClick={handleFeaturesClick}
            />
            <div className="absolute top-5 left-0 right-0 bottom-0 flex items-center z-20 justify-evenly">
                <Card
                    title="Real-Time Study Rooms"
                    containerFade={containerFade}
                    focused={cardsFocused}
                    listItems = {[
                        "Create private or public study rooms",
                        "Invite friends with a simple link",
                        "Real-time group chat for questions & answers",
                        "Stay accountable by studying together online",
                        "Switch between focus mode & collaboration mode"
                    ]}
                />
                <Card
                    title="Efficient Productivity Tools"
                    containerFade={containerFade}
                    focused={cardsFocused}
                    listItems ={[
                        "Built-in Pomodoro timer with custom settings",
                        "Automatic break reminders to prevent burnout",
                        "Track focus session history & stats",
                        "Customizable sound & notification alerts",
                        "Designed for both solo and group productivity"
                    ]}
                />
                <Card
                    title="Shared Notes & Resources"
                    containerFade={containerFade}
                    focused={cardsFocused}
                    listItems={[
                        "Upload class notes, PDFs, and study guides",
                        "Real-time note sharing with teammates",
                        "Organize files by subject or study group",
                        "Search notes quickly with built-in filters",
                        "Keep everything synced and accessible anytime"
                    ]}
                />
            </div>
            <Background />
            <div className="items-center absolute top-158 left-1/2 transform -translate-x-1/2 z-30">
                <ArrowButton 
                    fade={buttonFade}
                    appear={containerFade}
                />
            </div>
        </div>
    )
}