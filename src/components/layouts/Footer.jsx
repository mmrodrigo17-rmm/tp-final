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
    <footer className="bg-base-200 text-base-content py-8 mt-16">
      <div className="container mx-auto px-4">
        {/* Sección de información corporativa */}
        <div className="mb-6 text-center">
          <h3 className="text-xl font-bold mb-2">eCommerce Monumental S.A.</h3>
          <p className="text-base-content/70">Dirección: Av. Pres. Figueroa Alcorta 7597, Buenos Aires</p>
        </div>
        
        {/* Contenedor de las tarjetas del equipo.
            Uso grid con flex-wrap para que las tarjetas se reorganicen automáticamente en mobile. */}
        <div className="flex flex-wrap justify-center gap-4">
          
          {/* Recorro mi arreglo "team" usando el método map() de JavaScript.
              Por cada persona en el arreglo, devuelvo (renderizo) una card con su información. */}
          {team.map((person, index) => (
            // Es obligatorio en React pasar la prop "key" al iterar elementos.
            // Como esta es una lista estática (no voy a reordenar ni borrar elementos dinámicamente), 
            // usar el parámetro "index" (0, 1, 2...) como key es perfectamente válido y seguro.
            <div key={index} className="card card-compact w-48 bg-base-100 shadow-sm">
              <div className="card-body text-center">
                <h4 className="card-title">{person.name}</h4>
                <p className="text-base-content/70">{person.role}</p>
              </div>
            </div>
          ))}
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;