import logo from './assets/yusuf.svg?url';

function Header() {
    return (
      <header>
        <img className='max-h-28 p-2 mx-auto' src={logo} alt="Header"></img>
      </header>
    );
}

export default Header;