import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleCreate = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6ff] via-[#ffffff] to-[#f4f0ff] dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 font-sans text-gray-900 dark:text-gray-100 overflow-x-hidden transition-colors duration-300">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">L</div>
            <span className="font-bold text-xl tracking-tight">Lumina</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Use Case</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Pricing</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Contact</a>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <ThemeToggle />
          <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition py-2 px-4 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">Sign In</Link>
          <Link to="/login" className="bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 px-6 rounded-full transition shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center mt-20 px-4 text-center max-w-5xl mx-auto">
        {/* Pill Badge */}
        <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
          <span className="text-indigo-400">✦</span> Multi-Platform Publishing Made Easy
        </div>

        {/* Headlines */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 text-gray-800 dark:text-gray-100">
          Your Ultimate Social Media <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 dark:from-indigo-400 dark:to-purple-300">
            Post Composer Studio
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl">
          Create, edit, and publish engaging content directly to LinkedIn, X, and Instagram from one unified dashboard.
        </p>

        {/* CTA Bar */}
        <form onSubmit={handleCreate} className="flex items-center w-full max-w-xl bg-white dark:bg-gray-800 rounded-full p-2 shadow-xl shadow-indigo-100/50 dark:shadow-none border border-gray-100 dark:border-gray-700 mb-20 relative z-10 transition-colors">
          <input
            type="text"
            placeholder="Specify a writing task..."
            className="flex-1 bg-transparent border-none outline-none px-6 py-3 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-8 rounded-full font-medium transition flex items-center gap-2">
            Create <span>✧</span>
          </button>
        </form>

        {/* Dashboard Preview Mock */}
        <div className="relative w-full max-w-6xl mx-auto -mt-10 perspective-1000 z-0">
          {/* Subtle glow behind dashboard */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-purple-400/20 dark:bg-purple-900/30 blur-[120px] rounded-full"></div>
          
          <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white dark:border-gray-700 rounded-[2rem] shadow-2xl p-6 flex gap-6 transform rotate-x-12 scale-95 overflow-hidden transition-colors">
            
            {/* Sidebar Mock */}
            <div className="w-64 bg-white/80 dark:bg-gray-800/80 rounded-2xl p-4 flex flex-col gap-6 shadow-sm border border-gray-50/50 dark:border-gray-700/50">
              <div className="flex items-center gap-3 px-2">
                <div className="w-6 h-6 bg-gray-900 dark:bg-gray-100 rounded-md"></div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Lumina Workspace</span>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 px-3 mb-2 uppercase tracking-wider">General</p>
                <div className="bg-indigo-500 text-white rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-3">
                  <span className="opacity-80">⌂</span> Dashboard
                </div>
                <div className="text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition">
                  <span className="opacity-80">◷</span> History
                </div>
                <div className="text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition">
                  <span className="opacity-80">✨</span> Content Ideas
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 px-3 mb-2 uppercase tracking-wider mt-4">Platforms</p>
                <div className="text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition">
                   LinkedIn
                </div>
                <div className="text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition">
                   X (Twitter)
                </div>
                <div className="text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition">
                   Instagram
                </div>
              </div>
            </div>

            {/* Main Content Mock */}
            <div className="flex-1 bg-white/40 dark:bg-gray-800/40 rounded-2xl p-10 flex flex-col items-center pt-16 border border-white/50 dark:border-gray-700/50">
              <h2 className="text-5xl font-serif text-gray-900 dark:text-gray-100 mb-4 font-medium tracking-tight">What will you post today?</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-10 text-center">Draft, preview, and refine your social media content perfectly tailored for every platform.</p>
              
              <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 mb-8 h-40 relative transition-colors">
                 <p className="text-gray-400 dark:text-gray-500 text-sm p-2">Specify a writing task...</p>
                 <div className="absolute bottom-4 left-6 flex gap-4 text-gray-400 dark:text-gray-500 text-sm font-medium">
                    <span className="flex items-center gap-1">⌖ Focus</span>
                    <span className="flex items-center gap-1">📎 Attach</span>
                 </div>
                 <div className="absolute bottom-4 right-4 bg-indigo-400 dark:bg-indigo-500 text-white px-6 py-2 rounded-full text-sm font-medium opacity-80">
                   Create ✧
                 </div>
              </div>

              <div className="w-full max-w-3xl grid grid-cols-3 gap-4">
                 {[
                   { title: 'LinkedIn Content', desc: 'Create impactful posts that drive engagement...', color: 'bg-indigo-50 dark:bg-indigo-500/10', icon: 'text-indigo-500 dark:text-indigo-400' },
                   { title: 'Brand Voice', desc: 'Craft eye-catching captions and visuals...', color: 'bg-purple-50 dark:bg-purple-500/10', icon: 'text-purple-500 dark:text-purple-400' },
                   { title: 'Campaign Copywriting', desc: 'Create persuasive copy that speaks to your...', color: 'bg-blue-50 dark:bg-blue-500/10', icon: 'text-blue-500 dark:text-blue-400' },
                 ].map((card, i) => (
                   <div key={i} className={`${card.color} p-6 rounded-3xl opacity-70`}>
                     <div className={`w-10 h-10 bg-white dark:bg-gray-800 rounded-xl mb-4 shadow-sm flex items-center justify-center ${card.icon}`}>
                       ✧
                     </div>
                     <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{card.title}</h3>
                     <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{card.desc}</p>
                   </div>
                 ))}
              </div>
            </div>
            
          </div>
        </div>
      </main>
      
      {/* Footer spacer */}
      <div className="h-40"></div>
    </div>
  );
};

export default LandingPage;
