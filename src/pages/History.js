import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, Clock, Smile, Trash2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL; // ⭐ ADDED

const History = () => {
    const { user } = useAuth();
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchJournals = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API}/api/journals`, config); // ⭐ UPDATED
            setJournals(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJournals();
    }, [user]);

    const deleteJournal = async (id) => {
        if (!window.confirm('Are you sure you want to delete this journal? This might affect your streak.')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`${API}/api/journals/${id}`, config); // ⭐ UPDATED
            setJournals(journals.filter(j => j._id !== id));
        } catch (error) {
            console.error(error);
            alert('Failed to delete journal');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">Your Journey</h2>

            {loading ? (
                <div className="text-slate-400">Loading history...</div>
            ) : journals.length === 0 ? (
                <div className="glass-panel p-8 text-center">
                    <p className="text-slate-400">No journals yet. Start your streak today!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {journals.map((journal, index) => (
                        <motion.div
                            key={journal._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card p-6 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${journal.mood === 'Happy' ? 'bg-yellow-400/20 text-yellow-400' :
                                        journal.mood === 'Calm' ? 'bg-blue-300/20 text-blue-300' :
                                            journal.mood === 'Sad' ? 'bg-indigo-400/20 text-indigo-400' :
                                                'bg-red-400/20 text-red-400'
                                        }`}>
                                        <Smile size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-white">{journal.mood}</h3>
                                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                                            <Calendar size={14} />
                                            {new Date(journal.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                            <span className="text-slate-600">•</span>
                                            <Clock size={14} />
                                            {new Date(journal.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                                        {journal.timeTaken}s focused
                                    </div>
                                    <button
                                        onClick={() => deleteJournal(journal._id)}
                                        className="text-slate-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                                        title="Delete Journal"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-slate-300 leading-relaxed font-light">
                                {journal.content}
                            </p>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
