import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div>
      {location.pathname !== '/' && (
        <button onClick={() => navigate('/')}>Go back to home</button>
      )}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
