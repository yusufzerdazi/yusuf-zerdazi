import Header from './Header';
import Home from './Home';

function App() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header/>
      <main className='flex-1 overflow-hidden'>
        <Home/>
      </main>
    </div>
  );
}

export default App;
