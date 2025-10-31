document.addEventListener("DOMContentLoaded", () => {
  // ======================================
  // 0. EFEITO DE ABERTURA DO SITE
  // ======================================
  const splashScreen = document.getElementById("splash-screen");
  const body = document.body;
  
  // Detecta se o dispositivo é móvel
  const isMobile = window.innerWidth <= 768;
  
  // Pré-carrega os elementos principais para evitar "pulos"
  function preloadElements() {
    const sections = document.querySelectorAll(".header, .hero, .services, .about, .testimonials, .booking, .contact, .footer");
    sections.forEach(section => {
      if (section) {
        section.style.opacity = "0";
        section.style.transform = "translateY(0)"; // Mantém na posição correta, apenas invisível
        section.style.willChange = "opacity, transform";
      }
    });
  }
  
  // Executa o pré-carregamento
  preloadElements();
  
  // Impede a rolagem durante o carregamento
  body.style.overflow = "hidden";
  
  // Função para esconder a tela de splash com animação
  function hideSplashScreen() {
    splashScreen.classList.add("splash-hidden");
    
    // Habilita a rolagem após a animação
    setTimeout(() => {
      body.style.overflow = "";
      
      // Adiciona animação de entrada para os elementos da página de forma mais suave
      // Prioriza elementos visíveis na primeira dobra
      const sections = [
        document.querySelector(".header"),
        document.querySelector(".hero"),
        ...document.querySelectorAll(".services, .about, .testimonials, .booking, .contact, .footer")
      ].filter(Boolean);
      
      sections.forEach((section, index) => {
        setTimeout(() => {
          section.style.transition = `opacity ${isMobile ? '0.5s' : '0.8s'} ease`;
          section.style.opacity = "1";
        }, isMobile ? 30 * index : 50 * index); // Tempo reduzido em dispositivos móveis
      });
    }, isMobile ? 500 : 800); // Tempo reduzido em dispositivos móveis
  }
  
  // Esconde a tela de splash após o carregamento (tempo reduzido em dispositivos móveis)
  setTimeout(hideSplashScreen, isMobile ? 1800 : 2500);
  
  // ======================================
  // 1. MENU RESPONSIVO (MOBILE)
  // ======================================
  // Selecionando elementos do DOM
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const closeMenuBtn = document.querySelector(".close-menu-btn");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav-list a");
  const menuOverlay = document.querySelector(".menu-overlay");
  const header = document.querySelector(".header");

  // Função para fechar o menu mobile - otimizada
  function closeMenu() {
    // Aplicar classes sem manipulação de estilo direta
    nav.classList.remove("active");
    menuOverlay.classList.remove("active");
    mobileMenuBtn.classList.remove("active");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = ""; // Restaura rolagem
  }

  // Função para abrir o menu mobile - otimizada
  mobileMenuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // Aplicar classes sem manipulação de estilo direta
    nav.classList.add("active");
    menuOverlay.classList.add("active");
    mobileMenuBtn.classList.add("active");
    mobileMenuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden"; // Impede rolagem quando menu está aberto
  });

  // Fechar o menu ao clicar no botão de fechar
  closeMenuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeMenu();
  });

  // Cache para elementos de seção - otimizado
  const sectionCache = {};

  // Função otimizada para scroll suave com performance melhorada
  function smoothScroll(targetId) {
    // Usar cache para evitar repetidas consultas ao DOM
    if (!sectionCache[targetId]) {
      sectionCache[targetId] = document.querySelector(targetId);
    }

    const targetSection = sectionCache[targetId];
    if (!targetSection) return;

    const headerHeight = header.offsetHeight;
    const offsetTop =
      targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;

    // Usar scrollTo com easing nativo
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }

  // Fechar o menu ao clicar em um link - otimizado para navegação mais fluida
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const href = link.getAttribute("href");

        // Primeiro fecha o menu
        closeMenu();

        // Pequeno timeout para permitir que a animação do menu termine primeiro
        // Reduzido para melhorar a responsividade
        setTimeout(() => {
          smoothScroll(href);
        }, 50);
      }
    });
  });

  // Fechar o menu ao clicar no overlay
  menuOverlay.addEventListener("click", closeMenu);

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
  let ticking = false;

  // Função throttle para limitar a frequência de execução
  function throttle(callback, limit) {
    let waiting = false;
    return function () {
      if (!waiting) {
        callback.apply(this, arguments);
        waiting = true;
        setTimeout(() => {
          waiting = false;
        }, limit);
      }
    };
  }

  // Atualiza a barra de progresso conforme o scroll da página - otimizada
  function updateScrollProgress() {
    const windowScroll = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (windowScroll / height) * 100;

    if (scrollProgress) {
      // Usar requestAnimationFrame para otimizar a performance
      if (!ticking) {
        window.requestAnimationFrame(() => {
          scrollProgress.style.width = scrolled + "%";
          ticking = false;
        });
        ticking = true;
      }
    }
  }

  // Adiciona evento de scroll com throttle para melhor performance
  window.addEventListener("scroll", throttle(updateScrollProgress, 16)); // ~60fps

  // ======================================
  // 3. SCROLL SUAVE ENTRE SEÇÕES
  // ======================================
  // Cache para elementos de âncora
  const anchorCache = {};

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");

      // Usar cache para evitar repetidas consultas ao DOM
      if (!anchorCache[targetId]) {
        anchorCache[targetId] = document.querySelector(targetId);
      }

      const targetElement = anchorCache[targetId];
      if (targetElement) {
        // Usar scrollTo com easing nativo
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
  // Usar throttle para melhorar a performance
  function toggleHeaderClass() {
    if (window.scrollY > 50) {
      if (!header.classList.contains("scrolled")) {
        header.classList.add("scrolled");
      }
    } else if (header.classList.contains("scrolled")) {
      header.classList.remove("scrolled");
    }
  }

  // Verifica o scroll inicial
  toggleHeaderClass();

  // Adiciona evento de scroll com throttle para melhor performance
  window.addEventListener("scroll", throttle(toggleHeaderClass, 100));

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
        // Parar de observar após animar para melhorar performance
        animationObserver.unobserve(entry.target);
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

  // Função para mostrar/ocultar o botão baseado na posição do scroll - otimizada
  function toggleBackToTopButton() {
    if (window.scrollY > 300) {
      if (!backToTopButton.classList.contains("visible")) {
        backToTopButton.classList.add("visible");
      }
    } else if (backToTopButton.classList.contains("visible")) {
      backToTopButton.classList.remove("visible");
    }
  }

  // Adiciona evento de scroll com throttle para melhor performance
  window.addEventListener("scroll", throttle(toggleBackToTopButton, 100));

  // Adiciona evento de clique para voltar ao topo
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Inicializa todas as funções - apenas as necessárias no carregamento
  updateScrollProgress();
  toggleHeaderClass();
  toggleBackToTopButton();
});
