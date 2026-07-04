import styled from 'styled-components';

const StyledFooter = styled.footer`
  background: #333;
  color: #fff;
  padding: 2rem;
  margin-top: 2rem;
`;

const FooterTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const FooterText = styled.p`
  margin: 0.5rem 0;
  font-size: 0.95rem;
  opacity: 0.85;
`;

const TeamContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const TeamCard = styled.div`
  border: 1px solid #555;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  min-width: 160px;
`;

const team = [
  { name: "Rodrigo Morel", role: "Frontend Dev" },
  { name: "Marcelo Gallardo", role: "UX/UI Designer" },
  { name: "Enzo Pérez", role: "Backend Dev" }
];

const Footer = () => {
  return (
    <StyledFooter>
      <div>
        <FooterTitle>eCommerce Monumental S.A.</FooterTitle>
        <FooterText>Dirección: Av. Pres. Figueroa Alcorta 7597, Buenos Aires</FooterText>
      </div>
      <TeamContainer>
        {team.map((person, index) => (
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
