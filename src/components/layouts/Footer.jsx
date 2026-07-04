// Importo styled-components para escribir CSS directamente dentro del componente
// sin depender de archivos separados ni estilos en línea.
import styled from 'styled-components';

// --- Styled Components ---

// StyledFooter: contenedor principal del footer con fondo oscuro y texto claro.
const StyledFooter = styled.footer`
  background: #333;
  color: #fff;
  padding: 2rem;
  margin-top: 2rem;
`;

// FooterTitle: título estilizado para las secciones del footer.
const FooterTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

// FooterText: texto informativo en el footer.
const FooterText = styled.p`
  margin: 0.5rem 0;
  font-size: 0.95rem;
  opacity: 0.85;
`;

// TeamContainer: contenedor flex de las tarjetas del equipo.
// En pantallas angostas (mobile), los items se envuelven automáticamente (flex-wrap).
const TeamContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

// TeamCard: tarjeta individual para cada miembro del equipo.
const TeamCard = styled.div`
  border: 1px solid #555;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  min-width: 160px;
`;

// --- Componente Footer ---

const Footer = () => {
  // Defino un arreglo estático con la información de mi equipo de trabajo.
  // Al tener los datos estructurados en este arreglo de objetos, me resulta mucho más fácil
  // agregar, quitar o modificar miembros en el futuro sin tener que tocar el código HTML (JSX) de abajo.
  const team = [
    { name: "Rodrigo Morel", role: "Frontend Dev" },
    { name: "Marcelo Gallardo", role: "UX/UI Designer" },
    { name: "Enzo Pérez", role: "Backend Dev" }
  ];

  return (
    <StyledFooter>
      {/* Sección de información corporativa */}
      <div>
        <FooterTitle>eCommerce Monumental S.A.</FooterTitle>
        <FooterText>Dirección: Av. Pres. Figueroa Alcorta 7597, Buenos Aires</FooterText>
      </div>
      
      {/* Contenedor de las tarjetas del equipo.
          Uso TeamContainer que aplica Flexbox con wrap para que las tarjetas 
          se reorganicen automáticamente en mobile. */}
      <TeamContainer>
        
        {/* Recorro mi arreglo "team" usando el método map() de JavaScript.
            Por cada persona en el arreglo, devuelvo (renderizo) un TeamCard con su información. */}
        {team.map((person, index) => (
          // Es obligatorio en React pasar la prop "key" al iterar elementos.
          // Como esta es una lista estática (no voy a reordenar ni borrar elementos dinámicamente), 
          // usar el parámetro "index" (0, 1, 2...) como key es perfectamente válido y seguro.
          <TeamCard key={index}>
            <h4>{person.name}</h4>
            <FooterText>{person.role}</FooterText>
          </TeamCard>
        ))}
        
      </TeamContainer>
    </StyledFooter>
  );
};

export default Footer;