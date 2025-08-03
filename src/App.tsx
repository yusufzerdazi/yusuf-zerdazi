import Header from './Header';
import Home from './Home';
import { useState, useEffect } from 'react';

function App() {
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div className='flex flex-col min-h-screen'>
      {isMobile && <Header/>}
      <main className='flex-1 overflow-hidden'>
        <Home isMobile={isMobile} />
      </main>
    </div>
  );
}

export default App;
