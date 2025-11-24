import React, { useRef, useEffect } from 'react';

const InkCursor = ({ penType }) => {
    const canvasRef = useRef(null);
    const pointsRef = useRef([]);
    const requestRef = useRef();

    // Pen Styles Configuration
    const getPenStyle = (type) => {
        switch (type) {
            case 'steel_pen':
                return { color: '#000000', width: 2, shadow: 0, alpha: 1, composite: 'source-over' };
            case 'pencil':
                return { color: '#555555', width: 1.5, shadow: 0, alpha: 0.8, composite: 'source-over' }; // Needs texture logic ideally
            case 'marker':
                return { color: '#FF4500', width: 8, shadow: 2, alpha: 0.5, composite: 'multiply' }; // Example color, maybe dynamic?
            case 'quill':
                return { color: '#2F4F4F', width: 3, shadow: 1, alpha: 1, composite: 'source-over' }; // Variable width needed
            case 'ballpoint':
                return { color: '#000080', width: 1, shadow: 0, alpha: 0.9, composite: 'source-over' };
            case 'brush':
                return { color: '#000000', width: 12, shadow: 5, alpha: 0.7, composite: 'source-over' };
            case 'highlighter':
                return { color: '#FFFF00', width: 15, shadow: 0, alpha: 0.3, composite: 'multiply' };
            case 'invisible':
                return { color: '#FFFFFF', width: 2, shadow: 10, alpha: 0.1, composite: 'screen' }; // Glowing white
            default:
                return { color: '#000000', width: 2, shadow: 0, alpha: 1 };
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Resize handler
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const style = getPenStyle(penType);

        // Mouse move handler
        const handleMouseMove = (e) => {
            pointsRef.current.push({
                x: e.clientX,
                y: e.clientY,
                age: 0,
                force: Math.random() // For variation
            });
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Logic
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            // We can draw a continuous path or individual particles. 
            // For "fading trail", particles/segments are better.

            if (pointsRef.current.length < 2) {
                requestRef.current = requestAnimationFrame(animate);
                return;
            }

            ctx.beginPath();

            for (let i = 0; i < pointsRef.current.length - 1; i++) {
                const p1 = pointsRef.current[i];
                const p2 = pointsRef.current[i + 1];

                // Aging logic
                p1.age += 1;

                // Calculate opacity based on age
                const maxAge = 50; // Frames to live
                const life = 1 - (p1.age / maxAge);

                if (life <= 0) {
                    continue; // Skip dead points (will be cleaned up)
                }

                ctx.globalAlpha = style.alpha * life;
                ctx.strokeStyle = style.color;
                ctx.lineWidth = style.width;
                ctx.shadowBlur = style.shadow;
                ctx.shadowColor = style.color;
                ctx.globalCompositeOperation = style.composite || 'source-over';

                // Special logic for Quill/Brush (Variable width)
                if (penType === 'brush' || penType === 'quill') {
                    ctx.lineWidth = style.width * (1 + p1.force);
                }

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }

            // Cleanup dead points
            pointsRef.current = pointsRef.current.filter(p => p.age < 50);

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(requestRef.current);
        };
    }, [penType]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
        />
    );
};

export default InkCursor;
