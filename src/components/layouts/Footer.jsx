import estilos from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={estilos.footer}>
      <p>&copy; {new Date().getFullYear()} Mi Tienda Monumental</p>
      <p>Rodrigo Morel — Comisión 74530</p>
    </footer>
  );
};

export default Footer;
