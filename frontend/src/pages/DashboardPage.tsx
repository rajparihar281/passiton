import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ShoppingBag, Plus, List } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'service' | 'resources'>('service');
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeSection === 'service') {
        setActiveSection('resources');
      } else if (diff < 0 && activeSection === 'resources') {
        setActiveSection('service');
      }
    }
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const endX = e.clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeSection === 'service') {
        setActiveSection('resources');
      } else if (diff < 0 && activeSection === 'resources') {
        setActiveSection('service');
      }
    }
    setIsDragging(false);
  };

  return (
    <MainLayout>
      <div className="h-full flex flex-col animate-fadeIn">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            onClick={() => setActiveSection('service')}
            className={`p-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
              activeSection === 'service'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md'
            }`}
          >
            Service
          </button>
          <button
            onClick={() => setActiveSection('resources')}
            className={`p-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
              activeSection === 'resources'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md'
            }`}
          >
            Resources
          </button>
        </div>

        <div
          ref={containerRef}
          className="flex-1 bg-white rounded-lg shadow-lg p-6 overflow-hidden cursor-grab active:cursor-grabbing transition-shadow duration-300 hover:shadow-xl"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setIsDragging(false)}
        >
          <div className={`transition-all duration-500 ease-in-out ${
            activeSection === 'service' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute'
          }`}>
            <h2 className="text-2xl font-bold mb-6 animate-slideDown">Skill Economy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/skills')}
                className="p-6 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-all duration-300 transform hover:scale-105 hover:shadow-md animate-fadeInUp"
                style={{ animationDelay: '0.1s' }}
              >
                <Briefcase className="w-8 h-8 text-blue-600 mb-2 transition-transform duration-300 hover:scale-110" />
                <h3 className="font-semibold text-lg mb-1">Browse Skills</h3>
                <p className="text-sm text-gray-600">Find services offered by peers</p>
              </button>
              <button
                onClick={() => navigate('/skills/create')}
                className="p-6 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-all duration-300 transform hover:scale-105 hover:shadow-md animate-fadeInUp"
                style={{ animationDelay: '0.2s' }}
              >
                <Plus className="w-8 h-8 text-green-600 mb-2 transition-transform duration-300 hover:scale-110" />
                <h3 className="font-semibold text-lg mb-1">Offer Your Skill</h3>
                <p className="text-sm text-gray-600">List your services</p>
              </button>
              <button
                onClick={() => navigate('/my-skills')}
                className="p-6 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-all duration-300 transform hover:scale-105 hover:shadow-md animate-fadeInUp"
                style={{ animationDelay: '0.3s' }}
              >
                <List className="w-8 h-8 text-purple-600 mb-2 transition-transform duration-300 hover:scale-110" />
                <h3 className="font-semibold text-lg mb-1">My Skills</h3>
                <p className="text-sm text-gray-600">Manage your services</p>
              </button>
              <button
                onClick={() => navigate('/skill-bookings')}
                className="p-6 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-all duration-300 transform hover:scale-105 hover:shadow-md animate-fadeInUp"
                style={{ animationDelay: '0.4s' }}
              >
                <Briefcase className="w-8 h-8 text-orange-600 mb-2 transition-transform duration-300 hover:scale-110" />
                <h3 className="font-semibold text-lg mb-1">Bookings</h3>
                <p className="text-sm text-gray-600">View service requests</p>
              </button>
            </div>
          </div>
          <div className={`transition-all duration-500 ease-in-out ${
            activeSection === 'resources' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'
          }`}>
            <h2 className="text-2xl font-bold mb-6 animate-slideDown">Item Economy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/browse')}
                className="p-6 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-all duration-300 transform hover:scale-105 hover:shadow-md animate-fadeInUp"
                style={{ animationDelay: '0.1s' }}
              >
                <ShoppingBag className="w-8 h-8 text-blue-600 mb-2 transition-transform duration-300 hover:scale-110" />
                <h3 className="font-semibold text-lg mb-1">Browse Items</h3>
                <p className="text-sm text-gray-600">Find items to borrow</p>
              </button>
              <button
                onClick={() => navigate('/items/create')}
                className="p-6 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-all duration-300 transform hover:scale-105 hover:shadow-md animate-fadeInUp"
                style={{ animationDelay: '0.2s' }}
              >
                <Plus className="w-8 h-8 text-green-600 mb-2 transition-transform duration-300 hover:scale-110" />
                <h3 className="font-semibold text-lg mb-1">List an Item</h3>
                <p className="text-sm text-gray-600">Share your resources</p>
              </button>
              <button
                onClick={() => navigate('/my-items')}
                className="p-6 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-all duration-300 transform hover:scale-105 hover:shadow-md animate-fadeInUp"
                style={{ animationDelay: '0.3s' }}
              >
                <List className="w-8 h-8 text-purple-600 mb-2 transition-transform duration-300 hover:scale-110" />
                <h3 className="font-semibold text-lg mb-1">My Items</h3>
                <p className="text-sm text-gray-600">Manage your listings</p>
              </button>
              <button
                onClick={() => navigate('/transactions')}
                className="p-6 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-all duration-300 transform hover:scale-105 hover:shadow-md animate-fadeInUp"
                style={{ animationDelay: '0.4s' }}
              >
                <ShoppingBag className="w-8 h-8 text-orange-600 mb-2 transition-transform duration-300 hover:scale-110" />
                <h3 className="font-semibold text-lg mb-1">Transactions</h3>
                <p className="text-sm text-gray-600">View borrow history</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
