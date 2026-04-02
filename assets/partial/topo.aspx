<%--<%@ Page Language="C#" %>--%>

<header id="topo" class="fixed-top">
  <nav class="navbar navbar-expand-lg bg-azul-naval shadow-sm">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center" href="/marketing2/default2.aspx#inicio">
        <img id="logo-unip" src="/assets/img/logo/logo-unip.svg" alt="UNIP">
        <h1 class="h3 text-white ms-3 mt-1">Marketing</h1>
      </a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav"
        aria-controls="mainNav" aria-expanded="false" aria-label="Alternar navega&ccedil;&atilde;o">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link text-white" href="/marketing2/default2.aspx">In&iacute;cio</a></li>
          <li class="nav-item"><a class="nav-link text-white" href="/marketing2/comunicados.aspx">Comunicados</a></li>
          <li class="nav-item"><a class="nav-link text-white" href="/marketing2/default2.aspx#solicitacoes">Solicita&ccedil;&otilde;es</a></li>
          <li class="nav-item"><a class="nav-link text-white" href="/marketing2/materiais.aspx">Materiais</a></li>
          <li class="nav-item"><a class="nav-link text-white" href="/marketing2/contato.aspx">Contato</a></li>
          <li class="nav-item ms-lg-3">
            <a href="/marketing2/login.aspx" class="nav-link d-flex align-items-center gap-1 logout-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                aria-hidden="true" focusable="false" class="icon-logout">
                <path d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"></path>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</header>

<script>
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("topo");
  if (!header) return;

  const nav = header.querySelector("nav");
  const logo = document.getElementById("logo-unip");

  function updateHeaderOnScroll() {
    if (window.scrollY > 30) {
      header.classList.add("scrolled");
      nav.classList.remove("bg-azul-naval");
      if (logo) logo.src = "/assets/img/logo/logo-unip-azul.svg";
    } else {
      header.classList.remove("scrolled");
      nav.classList.add("bg-azul-naval");
      if (logo) logo.src = "/assets/img/logo/logo-unip.svg";
    }
  }

  window.addEventListener("scroll", updateHeaderOnScroll);
  updateHeaderOnScroll();
});
</script>
