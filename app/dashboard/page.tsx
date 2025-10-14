"use client";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ArrowUpRight, Calendar, Camera, DollarSign, Leaf, Newspaper, TrendingUp, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAccount } from 'wagmi';

import Cameraa from '@/components/camera';
import useContract from '@/hooks/useContract';
import { NewsArticle } from '@/types';

const Page = () => {
    const [showCamera, setShowCamera] = useState(false);
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [produceCount, setProduceCount] = useState<string>("0");
    const { isConnected } = useAccount();

    const { ProduceCount } = useContract();

    useEffect(() => {
        const fetchProduceCount = async () => {
            try {
                const count = await ProduceCount();
                setProduceCount(count || "0");
            } catch (error) {
                console.error("Failed to fetch produce count:", error);
                setProduceCount("0");
            }
        };

        fetchProduceCount();
    }, [ProduceCount]);

    const priceData = [
        { month: 'Jan', wheat: 250, rice: 180, corn: 200 },
        { month: 'Feb', wheat: 280, rice: 190, corn: 210 },
        { month: 'Mar', wheat: 260, rice: 195, corn: 205 },
        { month: 'Apr', wheat: 290, rice: 200, corn: 220 },
        { month: 'May', wheat: 310, rice: 210, corn: 230 },
        { month: 'Jun', wheat: 300, rice: 205, corn: 225 },
    ];

    useEffect(() => {
        const fetchurl = async () => {
            console.log("check");
            const url = 'https://newsapi.org/v2/top-headlines?' +
                'country=us&' +
                `apiKey=${process.env.NEXT_PUBLIC_NEWS_KEY!}`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                setNews(data.articles || []);
            } catch (error) {
                console.error("Failed to fetch news:", error);
            }
        }

        fetchurl();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
            <nav className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <Leaf className="w-8 h-8 text-green-600" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                CropChain
                            </span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => {
                                    if (!isConnected) alert("please connect your wallet");
                                    else setShowCamera(!showCamera);
                                }
                                }
                                className="p-2.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-300 hover:scale-110"
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                            <ConnectButton />
                        </div>
                    </div>
                </div>
            </nav>

            {showCamera && (
                <Cameraa setShowCamera={setShowCamera} showCamera={showCamera} />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-green-600 text-sm font-semibold flex items-center">
                                <ArrowUpRight className="w-4 h-4" />
                                +12%
                            </span>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Total Produce</h3>
                        <p className="text-3xl font-bold text-gray-900">{produceCount || 0}</p>
                        <p className="text-xs text-gray-500 mt-1">tons this year</p>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                                <Truck className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-orange-600 text-sm font-semibold">Live</span>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">In Transit</h3>
                        <p className="text-3xl font-bold text-gray-900">1,240</p>
                        <p className="text-xs text-gray-500 mt-1">tons shipping</p>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-4xl">💰</div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Total Revenue</h3>
                        <p className="text-3xl font-bold text-gray-900">$456,890</p>
                        <p className="text-xs text-gray-500 mt-1">all time earnings</p>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-purple-600 text-xs font-semibold">Holesky</span>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Total Earnings</h3>
                        <p className="text-3xl font-bold text-gray-900">45.8 ETH</p>
                        <p className="text-xs text-gray-500 mt-1">≈ $85,240 USD</p>
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Product Prices</h2>
                        <div className="flex space-x-4 text-sm">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-gray-600">Wheat</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-gray-600">Rice</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                <span className="text-gray-600">Corn</span>
                            </div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={priceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                            />
                            <Line type="monotone" dataKey="wheat" stroke="#10b981" strokeWidth={3} />
                            <Line type="monotone" dataKey="rice" stroke="#3b82f6" strokeWidth={3} />
                            <Line type="monotone" dataKey="corn" stroke="#f97316" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest News</h2>
                    <div className="space-y-4">
                        {news.length > 0 ? (
                            news.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start space-x-4 p-4 rounded-xl hover:bg-green-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-green-200"
                                    onClick={() => window.open(item.url, '_blank')}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Newspaper className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <span>{item.source.name}</span>
                                            <span>•</span>
                                            <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">Loading news...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;