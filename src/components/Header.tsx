import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <ul>
        <li>
          <Link to="/line">Line Chart</Link>
        </li>
        <li>
          <Link to="/pie">Pie Chart</Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
