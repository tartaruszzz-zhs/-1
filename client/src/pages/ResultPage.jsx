import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import InkCursor from '../components/InkCursor';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { result } = location.state || {};

    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p>No result found.</p>
                <button onClick={() => navigate('/')} className="mt-4 text-blue-500">Go Home</button>
            </div>
        );
    }

    const { dominant_type, pen_info, radar_values } = result;

    const chartData = {
        labels: ['钢笔', '铅笔', '马克笔', '羽毛笔', '圆珠笔', '毛笔', '荧光笔', '隐形笔'],
        datasets: [
            {
                label: 'Personality Dimensions',
                data: radar_values,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderColor: 'rgba(0, 0, 0, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            r: {
                angleLines: {
                    display: false
                },
                suggestedMin: 0,
                suggestedMax: 10 // Assuming max score around 10-15
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    };

    return (
        <div className="min-h-screen bg-paper-white text-ink-black relative overflow-hidden">
            {/* Ink Effect Layer */}
            <InkCursor penType={dominant_type} />

            <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col md:flex-row gap-12 items-center justify-center">

                {/* Left Column: Radar Chart */}
                <div className="w-full md:w-1/2 max-w-md bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                    <Radar data={chartData} options={chartOptions} />
                </div>

                {/* Right Column: Text Content */}
                <div className="w-full md:w-1/2 max-w-lg space-y-8">
                    <div>
                        <h3 className="text-xl font-serif text-gray-500 mb-2">{pen_info.name_en}</h3>
                        <h1 className="text-5xl font-serif font-bold mb-4">{pen_info.name}</h1>
                        <p className="text-2xl italic font-serif text-gray-700 border-l-4 border-black pl-4 py-2">
                            "{pen_info.slogan}"
                        </p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-lg">
                        <h4 className="font-bold text-lg mb-2">核心画像</h4>
                        <p className="leading-relaxed text-gray-800">{pen_info.core_traits}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-100/80 p-4 rounded-lg">
                            <h4 className="font-bold text-sm mb-2 text-gray-600">阴影面</h4>
                            <p className="text-sm text-gray-700">{pen_info.shadow_side}</p>
                        </div>
                        <div className="bg-gray-100/80 p-4 rounded-lg">
                            <h4 className="font-bold text-sm mb-2 text-gray-600">大师建议</h4>
                            <p className="text-sm text-gray-700">{pen_info.advice}</p>
                        </div>
                    </div>

                    <button
                        className="w-full bg-ink-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-transform hover:scale-105 shadow-xl"
                        onClick={() => alert('Unlock Full Report feature coming soon!')}
                    >
                        解锁深度 AI 报告 (¥19.9)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;
