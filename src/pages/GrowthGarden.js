import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import GrowthVisual from '../components/GrowthVisual';
import { motion } from 'framer-motion';
import { CheckCircle, Lock } from 'lucide-react';

const GrowthGarden = () => {
    const { user } = useAuth();

    // Milestones
    const milestones = [
        { stage: 'Seed', days: 0, unlocked: true },
        { stage: 'Sprout', days: 3, unlocked: user?.streak >= 3 },
        { stage: 'Plant', days: 7, unlocked: user?.streak >= 7 },
        { stage: 'Tree', days: 14, unlocked: user?.streak >= 14 },
        { stage: 'Forest', days: 30, unlocked: user?.streak >= 30 },
    ];

    const nextMilestone = milestones.find(m => !m.unlocked) || milestones[milestones.length - 1];
    const prevMilestone = milestones[[...milestones].reverse().findIndex(m => m.unlocked === true)]; // complicated finding
    // Easier: find current index based on stage
    const currentStageIndex = milestones.findIndex(m => m.stage === (user?.growthStage || 'Seed'));
    const nextIndex = Math.min(currentStageIndex + 1, milestones.length - 1);
    const nextStage = milestones[nextIndex];

    let progress = 0;
    if (user?.streak < 30) {
        const currentGoal = nextStage.days;
        const prevGoal = milestones[currentStageIndex].days;
        const totalNeeded = currentGoal - prevGoal;
        const currentProgress = user?.streak - prevGoal;
        progress = (currentProgress / totalNeeded) * 100;
        if (progress < 0) progress = 0;
        if (progress > 100) progress = 100;
        // If already at max stage
        if (user?.growthStage === 'Forest') progress = 100;
    } else {
        progress = 100;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Growth Garden</h2>
                <p className="text-slate-400">Your consistency nurtures your garden.</p>
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-panel p-12 flex flex-col items-center justify-center relative"
            >
                <div className="absolute top-4 right-4 bg-white/10 px-4 py-2 rounded-full text-sm font-medium text-emerald-300">
                    Current Streak: {user?.streak} days
                </div>

                <div className="scale-150 mb-8">
                    <GrowthVisual stage={user?.growthStage} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{user?.growthStage} Mode</h3>
                <p className="text-slate-400 mb-8 max-w-md text-center">
                    {user?.growthStage === 'Seed' && "Just the beginning. Keep watering with daily journals."}
                    {user?.growthStage === 'Sprout' && "You've broken ground! Keep going."}
                    {user?.growthStage === 'Plant' && "Roots are forming. Stand tall!"}
                    {user?.growthStage === 'Tree' && "Strong and steady. You're growing fast."}
                    {user?.growthStage === 'Forest' && "An ecosystem of thoughts. Truly magnificent."}
                </p>

                <div className="w-full max-w-md bg-slate-700 rounded-full h-4 mb-2 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="bg-gradient-to-r from-green-400 to-emerald-600 h-full rounded-full"
                    />
                </div>
                <p className="text-xs text-slate-500">
                    {user?.growthStage === 'Forest' ? 'Max Level Reached!' : `${Math.ceil(nextStage.days - user?.streak)} days until ${nextStage.stage}`}
                </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {milestones.map((m, idx) => (
                    <div key={m.stage} className={`glass-card p-4 flex flex-col items-center text-center ${m.unlocked ? 'border-emerald-500/50' : 'opacity-50'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${m.unlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>
                            {m.unlocked ? <CheckCircle size={20} /> : <Lock size={20} />}
                        </div>
                        <p className="font-semibold text-white">{m.stage}</p>
                        <p className="text-xs text-slate-400">{m.days} days</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GrowthGarden;
