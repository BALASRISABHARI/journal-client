import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { motion } from 'framer-motion';

const Analytics = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/journals/analytics', config);
                setStats(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchStats();
    }, [user]);

    const COLORS = ['#FACC15', '#60A5FA', '#818CF8', '#F87171']; // Handpicked for moods

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">Insights & Analytics</h2>

            {!stats ? (
                <div className="text-slate-400">Loading analytics...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Mood Distribution */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-panel p-6"
                    >
                        <h3 className="text-xl font-semibold text-white mb-6">Mood Distribution</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.moodData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.moodData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Summary Cards */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="glass-panel p-6"
                        >
                            <h3 className="text-xl font-semibold text-white mb-4">Quick Insights</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-800/50 p-4 rounded-xl">
                                    <p className="text-slate-400 text-sm">Total Journals</p>
                                    <p className="text-2xl font-bold text-white">{stats.totalJournals}</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl">
                                    <p className="text-slate-400 text-sm">Average Mood</p>
                                    <p className="text-2xl font-bold text-white">
                                        {stats.moodData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl">
                                    <p className="text-slate-400 text-sm">Current Streak</p>
                                    <p className="text-2xl font-bold text-emerald-400">{user?.streak} Days</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl">
                                    <p className="text-slate-400 text-sm">Garden Status</p>
                                    <p className="text-2xl font-bold text-amber-400">{user?.growthStage}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="glass-panel p-6"
                        >
                            <h3 className="text-xl font-semibold text-white mb-4">Emotional Weather Report</h3>
                            {(() => {
                                const dominant = stats.moodData.sort((a, b) => b.value - a.value)[0];
                                const weatherMap = {
                                    'Sunny': '☀️',
                                    'Cloudy': '⛅',
                                    'Rainy': '🌧️',
                                    'Stormy': '⛈️',
                                    'Unknown': '🌈'
                                };
                                const weatherDesc = {
                                    'Sunny': 'Bright and cheerful! A perfect day for growth.',
                                    'Cloudy': 'Calm and steady. Good conditions for reflection.',
                                    'Rainy': 'A bit heavy, but rain nourishes the soul.',
                                    'Stormy': 'Turbulent, but storms always pass.'
                                };
                                return (
                                    <div className="flex items-center gap-6">
                                        <div className="text-6xl animate-pulse">
                                            {weatherMap[dominant?.weather] || '🌈'}
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-white uppercase tracking-wide">
                                                Forecast: {dominant?.weather || 'Mixed'}
                                            </p>
                                            <p className="text-slate-400 text-sm mt-1">
                                                {weatherDesc[dominant?.weather] || 'Your emotions are balanced.'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })()}
                        </motion.div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
