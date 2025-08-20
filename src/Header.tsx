import logo from './assets/yusuf.svg?url';

function Header() {
    return (
      <header className="w-full dark:bg-gray-900">
        <img className='max-h-24 p-4 mx-auto' src={logo} alt="Header"></img>
      </header>
    );
}

export default Header;