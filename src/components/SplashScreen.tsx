import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';
import scoutLogo from '@/assets/scout-logo.png';

export default function SplashScreen() {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Start fade out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // Navigate to home after fade out completes
    const navTimer = setTimeout(() => {
      navigate('/home');
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div
      className={`fixed inset-0 bg-[#556B2F] flex items-center justify-center transition-opacity duration-1000 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center px-4 text-white flex items-center justify-center gap-8">
        <img src={logo} alt="Premier Open Group Logo" className="h-24 w-24 md:h-32 md:w-32 animate-scale-in rounded-full" />
        
        <div>
          <h2 className="text-lg md:text-2xl font-serif tracking-wide mb-2 animate-fade-in">
            THE BHARAT SCOUTS & GUIDES KARNATAKA
          </h2>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-scale-in">
            PREMIER OPEN GROUP
          </h1>
          <p className="text-sm md:text-base opacity-90 animate-fade-in">
            Sri Jayachamarajendra Scouts and Guides Headquarters
          </p>
        </div>
        
        <img src={scoutLogo} alt="Scout Logo" className="h-24 w-24 md:h-32 md:w-32 animate-scale-in" />
      </div>
    </div>
  );
}
