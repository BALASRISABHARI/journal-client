import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Award, Zap, Star, Shield, Lock, ShoppingBag } from 'lucide-react';
import axios from 'axios';

const Achievements = () => {
    const { user, updateUser } = useAuth();
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const badgesList = [
        { name: 'First Step', desc: 'Completed your first journal', icon: <Star size={24} className="text-yellow-400" /> },
        { name: 'Week Warrior', desc: 'Reached a 7-day streak', icon: <Zap size={24} className="text-orange-400" /> },
        { name: 'Consistency King', desc: 'Reached a 30-day streak', icon: <Award size={24} className="text-purple-400" /> },
        { name: 'Journal Master', desc: 'Wrote 50 journals', icon: <Shield size={24} className="text-emerald-400" /> },
    ];

    const buyFreezer = async () => {
        setLoading(true);
        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post('/api/journals/buy', { itemId: 'streak-freezer' }, config);

            setMsg(data.message);
            // Refresh user
            updateUser({ ...user, journalPoints: data.points, streakFreezers: data.streakFreezers });
        } catch (error) {
            setMsg(error.response?.data?.message || 'Purchase failed');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Achievements & Store</h2>
                    <p className="text-slate-400">Earn badges and use points to protect your streak.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-400 uppercase tracking-wider">Journal Points</p>
                    <p className="text-3xl font-bold text-yellow-400">{user?.journalPoints}</p>
                </div>
            </div>

            {/* Store Section */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-panel p-8"
            >
                <div className="flex items-center gap-3 mb-6">
                    <ShoppingBag className="text-indigo-400" size={24} />
                    <h3 className="text-xl font-bold text-white">Item Store</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-blue-500/20 p-3 rounded-xl">
                                <Shield size={32} className="text-blue-400" />
                            </div>
                            <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold">
                                50 PTS
                            </span>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white mb-1">Streak Freezer</h4>
                            <p className="text-slate-400 text-sm mb-4">Protects your streak if you miss one day of journaling.</p>
                            <p className="text-slate-300 text-sm mb-4">You have: <span className="font-bold text-white">{user?.streakFreezers || 0}</span></p>

                            <button
                                onClick={buyFreezer}
                                disabled={loading || user?.journalPoints < 50}
                                className={`w-full py-2 rounded-lg font-semibold transition-all ${user?.journalPoints >= 50
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30'
                                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                    }`}
                            >
                                {loading ? 'Purchasing...' : 'Buy Freezer'}
                            </button>
                            {msg && <p className={`mt-2 text-xs text-center ${msg.includes('failed') || msg.includes('Not') ? 'text-red-400' : 'text-green-400'}`}>{msg}</p>}
                        </div>
                    </div>

                    {/* Placeholder for future items */}
                    <div className="glass-card p-6 flex flex-col justify-between opacity-50 border-dashed border-2 border-slate-700">
                        <div className="text-center py-8">
                            <p className="text-slate-500 font-medium">More items coming soon...</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Badges Grid */}
            <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Award className="text-purple-400" /> Your Collection
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {badgesList.map((badge, idx) => {
                        const unlocked = user?.badges?.includes(badge.name);
                        return (
                            <motion.div
                                key={badge.name}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`glass-card p-6 flex flex-col items-center text-center ${unlocked ? 'border-amber-500/30 bg-amber-500/5' : 'opacity-60 grayscale'}`}
                            >
                                <div className={`p-4 rounded-full mb-4 ${unlocked ? 'bg-slate-800 shadow-xl' : 'bg-slate-800/50'}`}>
                                    {unlocked ? badge.icon : <Lock size={24} className="text-slate-600" />}
                                </div>
                                <h4 className={`font-bold mb-1 ${unlocked ? 'text-white' : 'text-slate-500'}`}>{badge.name}</h4>
                                <p className="text-xs text-slate-400">{badge.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};

export default Achievements;
