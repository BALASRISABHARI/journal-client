import React from 'react';
import { motion } from 'framer-motion';

const GrowthVisual = ({ stage }) => {
    const getVisual = () => {
        switch (stage) {
            case 'Seed':
                return <div className="text-[100px]">🌰</div>;
            case 'Sprout':
                return <div className="text-[100px]">🌱</div>;
            case 'Plant':
                return <div className="text-[100px]">🌿</div>;
            case 'Tree':
                return <div className="text-[100px]">🌳</div>;
            case 'Forest':
                return <div className="text-[100px]">🌲🌲</div>;
            default:
                return <div className="text-[100px]">🌰</div>;
        }
    };

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center items-center h-48 w-48 bg-white/5 rounded-full border-4 border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)]"
        >
            {getVisual()}
        </motion.div>
    );
};

export default GrowthVisual;
