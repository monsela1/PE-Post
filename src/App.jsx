import React, { useState } from 'react';
import { Upload, FileVideo, Send, Key, CheckCircle2 } from 'lucide-react';

export default function VideoPowerEditor() {
  const [token, setToken] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedPage, setSelectedPage] = useState(null);

  // ទិន្នន័យ Page ឧទាហរណ៍ (ពេលភ្ជាប់ API ពិតប្រាកដ យើងនឹងទាញយកពី Facebook)
  const mockPages = [
    { id: '101', name: 'MSL Tools Official', likes: '15K' },
    { id: '102', name: 'MSL FARM Store', likes: '8K' },
    { id: '103', name: 'Tech Automation', likes: '22K' },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-8 font-sans flex justify-center items-start">
      {/* Main Glassmorphism Container */}
      <div className="w-full max-w-4xl bg-[#1e293b]/60 backdrop-blur-xl border border-[#224078] rounded-2xl p-6 md:p-8 shadow-[0_0_20px_rgba(34,64,120,0.4)]">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 border-b border-[#224078]/50 pb-4">
          <FileVideo className="w-8 h-8 text-[#7EEDB2]" />
          <h1 className="text-2xl md:text-3xl font-bold text-[#7EEDB2] tracking-wider">VIDEO POWER EDITOR</h1>
        </div>

        {/* Token Input Section */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Key className="w-4 h-4" /> Facebook Access Token
          </label>
          <input
            type="text"
            placeholder="បញ្ចូល EAAG Token នៅទីនេះ..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full bg-[#0f172a] border border-[#224078] rounded-lg p-4 text-white focus:outline-none focus:border-[#7EEDB2] transition-colors"
          />
        </div>

        {/* Page Selection (Card-based Layout) */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-3">ជ្រើសរើស Page</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockPages.map((page) => (
              <div
                key={page.id}
                onClick={() => setSelectedPage(page.id)}
                className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 ${
                  selectedPage === page.id
                    ? 'border-[#7EEDB2] bg-[#224078]/40 shadow-[0_0_10px_rgba(126,237,178,0.2)]'
                    : 'border-[#224078] bg-[#0f172a]/50 hover:border-[#7EEDB2]/50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white">{page.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">Likes: {page.likes}</p>
                  </div>
                  {selectedPage === page.id && <CheckCircle2 className="w-5 h-5 text-[#7EEDB2]" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Video & Caption Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Video Upload Area */}
          <div className="border-2 border-dashed border-[#224078] hover:border-[#7EEDB2] bg-[#0f172a]/30 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors h-64">
            <Upload className="w-12 h-12 text-[#224078] mb-4" />
            <p className="text-gray-300 font-medium">ចុច ឬអូសវីដេអូទម្លាក់ទីនេះ</p>
            <p className="text-xs text-gray-500 mt-2">Support MP4, MOV (Max 1GB)</p>
          </div>

          {/* Caption Area */}
          <div className="flex flex-col h-64">
            <textarea
              placeholder="សរសេរ Caption សម្រាប់វីដេអូរបស់បងនៅទីនេះ..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full h-full bg-[#0f172a] border border-[#224078] rounded-xl p-4 text-white focus:outline-none focus:border-[#7EEDB2] resize-none transition-colors"
            />
          </div>
        </div>

        {/* POST Button */}
        <button className="w-full bg-[#224078] hover:bg-[#224078]/80 border border-[#7EEDB2]/50 text-[#7EEDB2] font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_15px_rgba(126,237,178,0.3)]">
          <Send className="w-6 h-6" />
          POST VIDEO NOW
        </button>

      </div>
    </div>
  );
}
