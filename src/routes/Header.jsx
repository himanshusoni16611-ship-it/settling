import './Header.css';
import { Link} from 'react-router-dom';

const Header = () => {
  return (
    <header className='header'>
      <h1 className='logo'>Mk</h1>
      <nav>
        <ul className='nav-list'>
          <Link to="/"><li>Home</li></Link>
          <Link to="/partyadd"><li>PartyAdd</li></Link>
         <Link to="/settlingentry"><li>SettlingEntry</li></Link>
          <Link to="/balancesheet"><li>BalanceSheet</li></Link>
       <Link to="/deleteall"><li>Deleteall</li></Link>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
