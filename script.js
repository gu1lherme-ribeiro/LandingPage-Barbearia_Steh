document.addEventListener("DOMContentLoaded", () => {
  // ======================================
  // 1. MENU RESPONSIVO (MOBILE)
  // ======================================
  // Selecionando elementos do DOM
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const closeMenuBtn = document.querySelector(".close-menu-btn");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav-list a");
  const menuOverlay = document.querySelector(".menu-overlay");

  // Função para fechar o menu mobile
  function closeMenu() {
    requestAnimationFrame(() => {
      nav.classList.remove("active");
      menuOverlay.classList.remove("active");
      mobileMenuBtn.classList.remove("active");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = ""; // Restaura rolagem
    });
  }

  // Função para abrir o menu mobile
  mobileMenuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    requestAnimationFrame(() => {
      nav.classList.add("active");
      menuOverlay.classList.add("active");
      mobileMenuBtn.classList.add("active");
      mobileMenuBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden"; // Impede rolagem quando menu está aberto
    });
  });

  // Fechar o menu ao clicar no botão de fechar
  closeMenuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMenu();
  });

  // Fechar o menu ao clicar em um link
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const href = link.getAttribute("href");
        
        // Primeiro fecha o menu
        closeMenu();
        
        // Depois navega para a seção após um pequeno delay
        setTimeout(() => {
          const targetSection = document.querySelector(href);
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: "smooth" });
          }
        }, 300);
      }
    });
  });

  // Fechar o menu ao clicar no overlay
  menuOverlay.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMenu();
  });

  // Fecha o menu ao pressionar ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("active")) {
      closeMenu();
    }
  });

  // ======================================
  // 2. SCROLL PROGRESS BAR
  // ======================================
  const scrollProgress = document.getElementById("scroll-progress");

  // Atualiza a barra de progresso conforme o scroll da página
  function updateScrollProgress() {
    const windowScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (windowScroll / height) * 100;

    if (scrollProgress) {
      scrollProgress.style.width = scrolled + "%";
    }
  }

  // Adiciona evento de scroll para atualizar a barra de progresso
  window.addEventListener("scroll", updateScrollProgress);

  // ======================================
  // 3. SCROLL SUAVE ENTRE SEÇÕES
  // ======================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Ajuste para compensar o header fixo
          behavior: "smooth",
        });
      }
    });
  });

  // ======================================
  // 4. HEADER FIXO DINÂMICO
  // ======================================
  const header = document.querySelector(".header");

  function toggleHeaderClass() {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  // Verifica o scroll inicial
  toggleHeaderClass();

  // Adiciona evento de scroll para atualizar a classe do header
  window.addEventListener("scroll", toggleHeaderClass);

  // ======================================
  // 5. ANIMAÇÕES ON SCROLL
  // ======================================
  // Usando IntersectionObserver para detectar elementos visíveis na tela
  const animatedElements = document.querySelectorAll(
    ".service-card, .about-content, .testimonials-card"
  );

  const observerOptions = {
    root: null, // viewport
    rootMargin: "0px",
    threshold: 0.2, // 20% do elemento visível
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Opcional: parar de observar após animar
        // animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observa todos os elementos que devem ser animados
  animatedElements.forEach((element) => {
    animationObserver.observe(element);
  });

  // ======================================
  // 6. BOTÃO "VOLTAR AO TOPO"
  // ======================================
  // Cria o botão dinamicamente
  const backToTopButton = document.createElement("button");
  backToTopButton.id = "back-to-top";
  backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopButton.setAttribute("aria-label", "Voltar ao topo");
  document.body.appendChild(backToTopButton);

  // Função para mostrar/ocultar o botão baseado na posição do scroll
  function toggleBackToTopButton() {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  }

  // Adiciona evento de scroll para mostrar/ocultar o botão
  window.addEventListener("scroll", toggleBackToTopButton);

  // Adiciona evento de clique para voltar ao topo
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Inicializa todas as funções
  updateScrollProgress();
  toggleHeaderClass();
  toggleBackToTopButton();
});
