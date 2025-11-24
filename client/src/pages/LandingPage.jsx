import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';

const LandingPage = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    // step: 'landing' (欢迎页) -> 'phone' (输入手机) -> 'code' (输入验证码)
    const [step, setStep] = useState('landing');
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

    // 渲染欢迎页 (新设计)
    const renderLanding = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-between min-h-screen bg-[#FFFDF5] px-6 py-10 text-center"
        >
            {/* Header / Logo */}
            <div className="flex flex-col items-center gap-2 mt-8">
                <div className="text-4xl">🐶</div>
                <h1 className="text-2xl font-bold text-[#4A4A4A] tracking-wider">测测笔格</h1>
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center gap-8 mt-12 w-full max-w-md">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-[#5D4037] leading-tight tracking-tight">
                        发现你的笔格人格<br />
                        <span className="text-[#FF9F43]">遇见与你同频的人!</span>
                    </h2>
                    <p className="text-[#8D6E63] text-base font-medium opacity-80">
                        20+ 精准心理题 · 2分钟完成测试
                    </p>
                </div>

                <div className="relative w-full flex flex-col items-center">
                    {/* 预留插画位置: 暂时用一个柔和的圆形背景代替,等待图片资源 */}
                    <div className="w-48 h-48 rounded-full bg-gradient-to-b from-orange-50 to-orange-100 flex items-center justify-center mb-8 shadow-inner">
                        <span className="text-orange-300 text-sm font-medium">插画位置</span>
                    </div>

                    <button
                        onClick={() => setStep('phone')}
                        className="absolute top-32 bg-[#FF9F43] text-white text-xl font-bold py-4 px-16 rounded-full shadow-lg shadow-orange-200/80 transform transition-all hover:scale-105 hover:bg-[#FF8F23] active:scale-95 z-10"
                    >
                        开始测试
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col items-center gap-3 mb-8 w-full">
                <p className="text-[#8D6E63] text-sm opacity-90">
                    已有 <span className="font-bold text-[#FF9F43]">14,328</span> 人参与
                </p>
                <div className="flex gap-6 text-xs text-[#BCAAA4]">
                    <span className="cursor-pointer hover:text-[#8D6E63]">关于我们</span>
                    <span className="cursor-pointer hover:text-[#8D6E63]">隐私协议</span>
                    <span className="cursor-pointer hover:text-[#8D6E63]">联系方</span>
                </div>
            </div>
        </motion.div>
    );

    // 渲染登录表单 (复用原有逻辑,样式微调适配新风格)
    const renderLoginForm = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF5] px-6"
        >
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-orange-100">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-[#5D4037]">
                        {step === 'phone' ? '手机号登录' : '输入验证码'}
                    </h2>
                    <p className="text-[#8D6E63] text-sm mt-2">
                        {step === 'phone' ? '开启你的笔格探索之旅' : `已发送至 ${phone}`}
                    </p>
                </div>

                {step === 'phone' ? (
                    <div className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#8D6E63] uppercase tracking-wider ml-1">手机号码</label>
                            <input
                                type="tel"
                                placeholder="请输入手机号"
                                className="w-full bg-[#FFFDF5] border border-orange-200 rounded-xl px-4 py-4 text-lg outline-none focus:ring-2 focus:ring-orange-300 transition-all placeholder-orange-200 text-[#5D4037]"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleSendCode}
                            disabled={loading || !phone}
                            className="w-full bg-[#FF9F43] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#FF8F23] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] shadow-lg shadow-orange-200"
                        >
                            {loading ? '发送中...' : '获取验证码'}
                        </button>
                        <button
                            onClick={() => setStep('landing')}
                            className="text-sm text-[#BCAAA4] hover:text-[#8D6E63]"
                        >
                            返回首页
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#8D6E63] uppercase tracking-wider ml-1">验证码</label>
                            <input
                                type="text"
                                placeholder="请输入6位验证码"
                                className="w-full bg-[#FFFDF5] border border-orange-200 rounded-xl px-4 py-4 text-lg outline-none focus:ring-2 focus:ring-orange-300 transition-all placeholder-orange-200 text-[#5D4037] text-center tracking-widest"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleVerify}
                            disabled={loading || !code}
                            className="w-full bg-[#FF9F43] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#FF8F23] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] shadow-lg shadow-orange-200"
                        >
                            {loading ? '验证中...' : '进入测试'}
                        </button>
                        <div className="flex justify-between text-sm">
                            <button onClick={() => setStep('phone')} className="text-[#BCAAA4] hover:text-[#8D6E63]">
                                更换手机号
                            </button>
                            <button onClick={handleSendCode} className="text-[#FF9F43] font-medium">
                                重新发送
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );

    return (
        <AnimatePresence mode="wait">
            {step === 'landing' ? (
                <React.Fragment key="landing">
                    {renderLanding()}
                </React.Fragment>
            ) : (
                <React.Fragment key="login">
                    {renderLoginForm()}
                </React.Fragment>
            )}
        </AnimatePresence>
    );
};

export default LandingPage;
