import Header from './Header';
import Home from './Home';
import Footer from './Footer';

function App() {
  return (
    <div className='flex flex-col h-screen justify-between'>
      <Header/>
      <Home/>
      <Footer/>
    </div>
  );
}

export default App;
