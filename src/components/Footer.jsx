import { Link } from 'react-router-dom';
import { Scale, ShieldAlert } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: '#0a192f',
      borderTop: '2px solid #233554',
      padding: '24px 40px',
      color: '#8892b0',
      fontFamily: 'monospace',
      fontSize: '0.85rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px',
      marginTop: 'auto'
    }}>
      <div>
        © {new Date().getFullYear()} Koboya Standardisation and Registry Authority (KSRA). All rights reserved.
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Scale size={16} color="#90cdf4" />
          <Link to="/tos" style={{ color: '#90cdf4', textDecoration: 'none', fontWeight: 600 }}>
            Terms of Service
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={16} color="#90cdf4" />
          <Link to="/pp" style={{ color: '#90cdf4', textDecoration: 'none', fontWeight: 600 }}>
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
