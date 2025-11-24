import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState('phone'); // phone, code
    const [loading, setLoading] = useState(false);

    const handleSendCode = async () => {
        if (!phone) return;
        setLoading(true);
        try {
            await api.post('/auth/send-code', { phone });
            setStep('code');
        } catch (err) {
            alert('发送验证码失败: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!code) return;
        setLoading(true);
        try {
            const res = await api.post('/auth/verify', { phone, code });
            localStorage.setItem('token', res.data.token);
            navigate('/test');
        } catch (err) {
            alert('验证失败: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#f0f0f0]">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-gray-200 to-gray-300 blur-[100px] opacity-60"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-gray-300 to-gray-400 blur-[100px] opacity-60"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md px-6"
            >
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-serif font-bold text-ink-black mb-4 tracking-tight">测测笔格</h1>
                    <p className="text-lg text-gray-500 font-light tracking-widest uppercase">探索你灵魂的笔触</p>
                </div>

                <div className="bg-white/40 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-2xl">
                    {step === 'phone' ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">手机号码</label>
                                <input
                                    type="tel"
                                    placeholder="请输入手机号"
                                    className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-4 text-lg outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30 transition-all placeholder-gray-300"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleSendCode}
                                disabled={loading || !phone}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] shadow-lg shadow-blue-500/50"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        发送中...
                                    </span>
                                ) : '开启旅程'}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">验证码</label>
                                <input
                                    type="text"
                                    placeholder="请输入6位验证码"
                                    className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-4 text-lg outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30 transition-all placeholder-gray-300 tracking-widest text-center"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleVerify}
                                disabled={loading || !code}
                                className="w-full bg-ink-black text-white py-4 rounded-xl font-medium text-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] shadow-lg shadow-black/20"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        验证中...
                                    </span>
                                ) : '进入测试'}
                            </button>
                            <button
                                onClick={() => setStep('phone')}
                                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                更换手机号
                            </button>
                        </motion.div>
                    )}
                </div>

                <p className="text-center text-gray-400 text-xs mt-8 font-light">
                    进入即代表您同意探索真实的自我
                </p>
            </motion.div>
        </div>
    );
};

export default LandingPage;
