import { useState } from 'react';

function Background () {
    const [coordinates, setCoordinates] = useState({x: 0, y: 0})
    const [isHovered, setIsHovered] = useState(false)

    function getCoordinates (background) {
        setCoordinates({x: background.clientX, y: background.clientY});
        setIsHovered(true)
    }

    return (
        <>
            <div 
            onMouseMove={getCoordinates}
            className="h-screen bg-black text-[rgb(244,229,200)] flex justify-center items-center relative cursor-none">
                <h1 className="z-10 text-6xl">Click Anywhere to Start</h1>
                {isHovered && <div className="blur-lg z-0 pointer-events-none absolute w-15 h-15 rounded-full bg-cyan-400"
                     style={{
                        left: coordinates.x - 20,
                        top: coordinates.y - 20,
                     }}>
                </div>}
            </div>
        </>
    )
}

export default function Continue () {
    return (
        <Background />
    )
}