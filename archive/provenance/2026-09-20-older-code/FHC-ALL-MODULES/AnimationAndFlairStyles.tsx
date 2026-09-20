import React from 'react';

const AnimationAndFlairStyles = () => (
    <style>{`
        @keyframes slideDown {
             from { opacity: 0; transform: translateY(-20px); }
             to { opacity: 1; transform: translateY(0); }
        }
        .slide-down {
            animation: slideDown 0.5s ease-out forwards;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .fade-in {
            animation: fadeIn 0.5s ease-in-out;
        }
    `}</style>
);

export default AnimationAndFlairStyles;