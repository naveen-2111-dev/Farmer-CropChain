"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ChevronRight, Leaf, Shield, Sprout, TrendingUp, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

export default function Home() {
  const { isConnected } = useAccount();
  const route = useRouter();

  const features = [
    {
      icon: <Sprout className="w-6 h-6" />,
      title: "Crop Tracking",
      description: "Track your crops from harvest to market on blockchain"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Market Access",
      description: "Direct connection to buyers and fair pricing"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Records",
      description: "Immutable records of your farming activities"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community",
      description: "Connect with farmers and share knowledge"
    }
  ];

  const handleRoute = () => {
    if (!isConnected) {
      alert("please connect your wallet first");
      route.push("/");
    } else {
      route.push("/dashboard");
    }
  }

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
            <ConnectButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6">
            <Sprout className="w-4 h-4" />
            <span className="text-sm font-semibold">Blockchain-Powered Agriculture</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Welcome to
            <span className="block bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              CropChain Farmer
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Empowering farmers with blockchain technology for transparent,
            secure, and profitable farming operations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => handleRoute()} className="px-8 cursor-pointer py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
              <span>Get Started</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-green-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-white/70 backdrop-blur-sm rounded-3xl p-10 border border-green-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                10,000+
              </div>
              <div className="text-gray-600 font-medium">Active Farmers</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                50,000+
              </div>
              <div className="text-gray-600 font-medium">Crops Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                $5M+
              </div>
              <div className="text-gray-600 font-medium">Total Value Secured</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}