import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import GrowthVisual from '../components/GrowthVisual';
import { motion } from 'framer-motion';
import { Flame, Book, Calendar, Sun, Cloud, CloudRain, Zap, Send, Clock, Lock, Play } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
    const { user, updateUser } = useAuth();
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('');
    const [elapsedTime, setElapsedTime] = useState(0);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [isJournaledToday, setIsJournaledToday] = useState(false);
    const [isWriting, setIsWriting] = useState(false);

    useEffect(() => {
        let interval;
        if (isWriting) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isWriting]);

    // Check if user journaled today locally
    useEffect(() => {
        if (user?.lastJournalDate) {
            const last = new Date(user.lastJournalDate);
            const today = new Date();
            const isSame = last.getFullYear() === today.getFullYear() &&
                last.getMonth() === today.getMonth() &&
                last.getDate() === today.getDate();
            setIsJournaledToday(isSame);
        }
    }, [user]);

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
                if (!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('/api/auth/me', config);
                updateUser({ ...data, token });
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const startJournaling = () => {
        setIsWriting(true);
        setElapsedTime(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!mood) {
            setMsg('Please select a mood.');
            return;
        }
        setLoading(true);
        setIsWriting(false); // Stop timer

        try {
            const token = user.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('/api/journals', {
                content,
                mood,
                timeTaken: elapsedTime
            }, config);

            setMsg('Journal verified! +10 Points');
            setContent('');
            setMood('');
            setIsJournaledToday(true);

            const { data } = await axios.get('/api/auth/me', config);
            updateUser({ ...data, token });
        } catch (error) {
            setIsWriting(true); // Resume on error?
            setMsg(error.response?.data?.message || 'Failed to submit journal');
        }
        setLoading(false);
    };

    const moods = [
        { name: 'Happy', icon: <Sun size={24} />, color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
        { name: 'Calm', icon: <Cloud size={24} />, color: 'text-blue-300', bg: 'bg-blue-300/20' },
        { name: 'Sad', icon: <CloudRain size={24} />, color: 'text-indigo-400', bg: 'bg-indigo-400/20' },
        { name: 'Angry', icon: <Zap size={24} />, color: 'text-red-400', bg: 'bg-red-400/20' },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Header Stats */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <div className="glass-card p-6 flex items-center justify-between relative overflow-hidden">
                    <div>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Current Streak</p>
                        <h3 className="text-4xl font-bold text-white mt-1">{user?.streak} <span className="text-lg text-slate-500 font-normal">days</span></h3>
                    </div>
                    <div className="bg-orange-500/20 p-4 rounded-full">
                        <Flame size={32} className="text-orange-500" />
                    </div>
                </div>

                <div className="glass-card p-6 flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Journals</p>
                        <h3 className="text-4xl font-bold text-white mt-1">{user?.totalJournals}</h3>
                    </div>
                    <div className="bg-indigo-500/20 p-4 rounded-full">
                        <Book size={32} className="text-indigo-500" />
                    </div>
                </div>

                <div className="glass-card p-6 flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Growth Stage</p>
                        <h3 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600 mt-1">{user?.growthStage}</h3>
                    </div>
                    {/* Ensure Emoji Visual passes the correct stage */}
                    <div className="scale-75">
                        <GrowthVisual stage={user?.growthStage || 'Seed'} />
                    </div>
                </div>
            </motion.div>

            {/* Write Journal Section */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-panel p-8 relative overflow-hidden"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {isJournaledToday ? 'You reflected today' : 'Write Today\'s Journal'}
                    </h2>
                    <div className="text-slate-400 text-sm flex items-center gap-2">
                        <Calendar size={16} />
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                {msg && (
                    <div className={`p-4 rounded-lg mb-4 text-sm ${msg.includes('Verified') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {msg}
                    </div>
                )}

                {isJournaledToday ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="bg-emerald-500/10 p-6 rounded-full mb-4">
                            <Lock size={48} className="text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Daily Journal Complete</h3>
                        <p className="text-slate-400 max-w-md">
                            "One day, one journal." You've already planted your seed for today.
                            Come back tomorrow to keep your streak growing!
                        </p>
                    </div>
                ) : !isWriting ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-slate-400 mb-6 max-w-md">
                            Ready to take 2 minutes for yourself? Click start to begin your session.
                        </p>
                        <button
                            onClick={startJournaling}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-indigo-500/30 flex items-center gap-3 transition-transform hover:scale-105"
                        >
                            <Play size={24} fill="white" />
                            Start Journal ({formatTime(elapsedTime)})
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl mb-6 border border-slate-700">
                            <div>
                                <p className="text-sm text-slate-400">Time Elapsed</p>
                                <p className="text-2xl font-mono text-white font-bold">{formatTime(elapsedTime)}</p>
                            </div>
                            <div className="animate-pulse">
                                <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-slate-300 text-sm font-medium mb-3">How are you feeling right now?</label>
                            <div className="flex gap-4 flex-wrap">
                                {moods.map((m) => (
                                    <button
                                        key={m.name}
                                        type="button"
                                        onClick={() => setMood(m.name)}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${mood === m.name ? `${m.bg} border-2 border-${m.color.split('-')[1]}-400` : 'bg-slate-800 border border-slate-700 hover:bg-slate-700'
                                            }`}
                                    >
                                        <span className={m.color}>{m.icon}</span>
                                        <span className="text-slate-200 font-medium">{m.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-slate-300 text-sm font-medium mb-2">What's on your mind?</label>
                            <textarea
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Start writing..."
                                className="w-full h-40 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <p className="text-xs text-slate-500">
                                Points: {user?.journalPoints} | Earn 10 points per journal
                            </p>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex items-center gap-2"
                            >
                                {loading ? 'Saving...' : 'Stop & Save Journal'}
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default Dashboard;
