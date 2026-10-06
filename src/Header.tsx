import logo from './assets/yusuf.svg?url';

function Header() {
    return (
      <header className="relative z-20 w-full">
        <img className='max-h-24 p-4 mx-auto' src={logo} alt="Header"></img>
      </header>
    );
}

export default Header;