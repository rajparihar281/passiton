import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut');
    }
  }, [location, displayLocation]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main 
        className={`flex-1 p-8 overflow-auto transition-opacity duration-300 ${
          transitionStage === 'fadeOut' ? 'opacity-0' : 'opacity-100'
        }`}
        onTransitionEnd={() => {
          if (transitionStage === 'fadeOut') {
            setTransitionStage('fadeIn');
            setDisplayLocation(location);
          }
        }}
      >
        <div className="animate-fadeIn">
          {transitionStage === 'fadeOut' ? children : children}
        </div>
      </main>
    </div>
  );
};
