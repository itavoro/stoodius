import { useState, useEffect } from 'react';

function Background (props) {
    return (
        <div className="flex flex-col h-screen relative">
            <div id="bg1" className="bg-black flex-1 w-0"></div>
            <div id="bg2" className="bg-black flex-1 w-0 ml-auto"></div>
            <div id="bg3" className="bg-black flex-1 w-0"></div>
            <div id="bg4" className="bg-black flex-1 w-0 ml-auto"></div>
            <div id="bg5" className="bg-black flex-1 w-0"></div>
            <div id="bg1" className="bg-black flex-1 w-0 ml-auto"></div>
            <div id="bg2" className="bg-black flex-1 w-0"></div>
            <div id="bg3" className="bg-black flex-1 w-0 ml-auto"></div>
            <div id="bg4" className="bg-black flex-1 w-0"></div>
            <div id="bg5" className="bg-black flex-1 w-0 ml-auto"></div>
            <div id="bg1" className="bg-black flex-1 w-0"></div>
            <div id="bg2" className="bg-black flex-1 w-0 ml-auto"></div>
            <div id="bg3" className="bg-black flex-1 w-0"></div>
            <div id="bg4" className="bg-black flex-1 w-0 ml-auto"></div>
            <div id="bg5" className="bg-black flex-1 w-0"></div>
            {props.children}
        </div>
    )
}

function Navigation (props) {
    return (
        <nav className="border-2 border-white rounded-4xl fixed top-1/20 left-1/2 z-50 bg-black h-[10vh] w-[200vh] flex items-center text-[rgb(245,245,245)] -translate-x-1/2"
        style={{fontWeight: 'bold',
                opacity: props.containerFade ? 1 : 0,
                transition: 'opacity 1s ease',
                boxShadow: "0px 0px 20px 0px white"
        }}>
            <a 
            className="ml-10 text-3xl">
                STOODIUS ︱ <span className="italic">Study With Friends</span>
            </a>
            <button className="rounded-4xl mr-6 ml-auto p-1.5 px-5 border-2 hover:bg-gray-200 hover:text-black transition-colors duration-200">
                Features
            </button>
            <button className="rounded-4xl mr-6 p-1.5 border-2 px-5 hover:bg-gray-200 hover:text-black transition-colors duration-200">
                Sign In
            </button>
            <button className="rounded-4xl mr-6 p-1.5 border-2 px-5 hover:bg-gray-200 hover:text-black transition-colors duration-200">
                Sign Up
            </button>
        </nav>
    )
}

function Card (props) {
    return (
        <div style={{
            opacity: props.containerFade ? 1 : 0,
            transition: "opacity 1s ease",
            boxShadow: "0px 0px 10px 0px white"
        }}
            className="border-white border-2 bg-black text-center h-[440px] px-10 w-[400px] text-white rounded-3xl">
            <h2 className="block mt-10 text-2xl">{props.title}</h2>
            <ul className="text-left mt-5 list-disc list-inside text-xl">
                {props.listItems.map((item, index) => (
                    <li key={index}>{item}</li>
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
                        transition: "opacity 1s ease",
                        boxShadow: "0px 0px 10px 0px white"
                }}
                onClick = {() => window.scrollTo({top: 1000, behavior: 'smooth' })}
                className="text-5xl text-white rounded-full border-white border-4 h-17 w-50 flex items-center justify-center hover:bg-gray-200 hover:text-black transition-colors duration-200">
                    &darr;
                </button>
            )
    }
  
}

export default function Welcome () {
    const [containerFade, setContainerFade] = useState(false)
    const [navFade, setNavFade] = useState(false)
    const [buttonFade, setButtonFade] = useState(false)
    setTimeout(() => {setNavFade(true); document.body.style.background = 'black'}, 1700)
    setTimeout(() => {setContainerFade(true)}, 2200)
    setTimeout(() => {setButtonFade(true)}, 2700)

    return (
        <div className="relative flex flex-col justify-center">
            <Navigation 
                containerFade={navFade}
            />
            <div className="absolute top-5 left-0 right-0 bottom-0 flex items-center z-20 justify-evenly">
                <Card
                    title="Real-Time Study Rooms"
                    containerFade={containerFade}
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
            <div className="bg-black items-center absolute top-158 left-1/2 transform -translate-x-1/2 z-30">
                <ArrowButton 
                    fade={buttonFade}
                    appear={containerFade}
                />
            </div>
        </div>
    )
}