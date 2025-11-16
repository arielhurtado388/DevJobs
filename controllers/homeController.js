const mostrarTrabajos = (req, res) => {
  res.render("home", {
    pagina: "DevJobs",
    tagline: "Encuentra y publica trabajos para desarrolladores web",
    barra: true,
    boton: true,
  });
};

export { mostrarTrabajos };
