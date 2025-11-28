document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const exploreBtn = document.getElementById('explore-btn');

    // --- Funcionalidade do Menu Hamburguer ---
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Fechar o menu ao clicar em um link (apenas para mobile)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // --- Scroll Suave para Ancoras ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Botão "Comece a Explorar" ---
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            document.getElementById('pontos-turisticos').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // --- Funcionalidade do Modal de Detalhes (Lê do HTML) ---
    const modal = document.getElementById('details-modal');
    if (modal) {
        const closeModalBtn = document.querySelector('.close-button');
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalInfo = document.getElementById('modal-info');
        const modalMap = document.getElementById('modal-map');

        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const card = e.target.closest('.card'); // Encontra o card pai
                if (card) {
                    // Pega as informações diretamente dos elementos filhos do card
                    const imageUrl = card.querySelector('img').src;
                    const title = card.querySelector('h3').textContent;
                    const shortDescription = card.querySelector('.short-description') ? card.querySelector('.short-description').textContent : '';
                    const longDescription = card.querySelector('.long-description') ? card.querySelector('.long-description').textContent : shortDescription; // Usa a curta se a longa não existir
                    const extraInfo = card.querySelector('.extra-info') ? card.querySelector('.extra-info').textContent : '';
                    const location = card.querySelector('.location') ? card.querySelector('.location').textContent : 'Não informado';

                    if (modalImage) modalImage.src = imageUrl;
                    if (modalImage) modalImage.alt = title;
                    if (modalTitle) modalTitle.textContent = title;
                    if (modalDescription) modalDescription.textContent = longDescription;
                    if (modalInfo) modalInfo.innerHTML = `<strong>Informações:</strong> ${extraInfo}`;
                    if (modalMap) modalMap.innerHTML = `<p>Localização: ${location}</p><p>(Simulação de Mapa)</p>`; // Exibir localização ou iframe de mapa

                    modal.style.display = 'flex'; // Exibe o modal
                }
            });
        });

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Fechar modal ao clicar fora do conteúdo
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // --- Funcionalidade do Formulário de Contato (Simulado) ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Mensagem enviada com sucesso! (Esta é uma simulação)');
            contactForm.reset();
        });
    }

    // --- Carrossel de Fotos na seção inicial (home) ---
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        const slides = Array.from(carouselContainer.querySelectorAll('.slide'));
        if (slides.length === 0) {
            // nada a fazer se não houver slides
        } else {
            const prevBtn = carouselContainer.querySelector('.carousel-control.prev');
            const nextBtn = carouselContainer.querySelector('.carousel-control.next');
            const dots = Array.from(carouselContainer.querySelectorAll('.dot'));
            let current = 0;
            let autoplayInterval = null;
            // Tempo entre slides em milissegundos
            const AUTOPLAY_DELAY = 3000;

            function showSlide(index) {
                index = ((index % slides.length) + slides.length) % slides.length; // normaliza índice
                slides.forEach((s, i) => s.classList.toggle('active', i === index));
                if (dots && dots.length) dots.forEach((d, i) => d.classList.toggle('active', i === index));
                current = index;
            }

            function nextSlide() { showSlide(current + 1); }
            function prevSlide() { showSlide(current - 1); }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
            }
            if (prevBtn) {
                prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
            }

            if (dots && dots.length) {
                dots.forEach(dot => {
                    dot.addEventListener('click', (e) => {
                        const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                        if (!Number.isNaN(idx)) {
                            showSlide(idx);
                            resetAutoplay();
                        }
                    });
                });
            }

            function startAutoplay() {
                if (autoplayInterval) return; // evita múltiplos intervals
                autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
            }
            function stopAutoplay() {
                if (autoplayInterval) {
                    clearInterval(autoplayInterval);
                    autoplayInterval = null;
                }
            }
            function resetAutoplay() { stopAutoplay(); startAutoplay(); }

            // Pausa ao passar o mouse (útil em desktop)
            carouselContainer.addEventListener('mouseenter', stopAutoplay);
            carouselContainer.addEventListener('mouseleave', startAutoplay);

            // Pausa em visibilidade oculta para economizar CPU
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) stopAutoplay(); else startAutoplay();
            });

            // Suporte básico a toque: pausa durante o toque
            carouselContainer.addEventListener('touchstart', stopAutoplay, { passive: true });
            carouselContainer.addEventListener('touchend', startAutoplay, { passive: true });

            // Inicializa
            showSlide(0);
            startAutoplay();
        }
    }

    // --- Modal Saiba Mais para Pontos Turísticos ---
    window.abrirModal = function(button) {
        const card = button.closest('.card');
        const modal = document.getElementById('modal-saiba-mais');
        if (card && modal) {
            const titulo = card.getAttribute('data-title');
            const imagem = card.getAttribute('data-image');
            const descricao = card.getAttribute('data-description');
            const horario = card.getAttribute('data-horario');
            const entrada = card.getAttribute('data-entrada');
            const acesso = card.getAttribute('data-acesso');
            const ideal = card.getAttribute('data-ideal');

            document.getElementById('modal-titulo').textContent = titulo;
            document.getElementById('modal-img').src = imagem;
            document.getElementById('modal-img').alt = titulo;
            document.getElementById('modal-desc').textContent = descricao;
            document.getElementById('modal-horario').textContent = horario || 'N/A';
            document.getElementById('modal-entrada').textContent = entrada || 'N/A';
            document.getElementById('modal-acesso').textContent = acesso || 'N/A';
            document.getElementById('modal-ideal').textContent = ideal || 'N/A';

            modal.style.display = 'flex';
        }
    };

    window.fecharModal = function() {
        const modal = document.getElementById('modal-saiba-mais');
        if (modal) {
            modal.style.display = 'none';
        }
    };

    // Fechar modal ao clicar fora do conteúdo
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('modal-saiba-mais');
        if (modal && e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Fechar modal ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('modal-saiba-mais');
            if (modal) {
                modal.style.display = 'none';
            }
        }
    });

    // --- Botões 'Como Chegar' com Geolocation ---
    document.querySelectorAll('.btn-maps').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Preferir atributos data-lat / data-lng quando existentes
            const dataLat = this.getAttribute('data-lat') || this.dataset.lat;
            const dataLng = this.getAttribute('data-lng') || this.dataset.lng;
            let destination = '';

            if (dataLat && dataLng) {
                destination = `${dataLat},${dataLng}`;
            } else {
                // Tenta extrair destination do href (?destination=...)
                const href = this.href || this.getAttribute('data-href') || '';
                try {
                    const u = new URL(href, window.location.origin);
                    const destParam = u.searchParams.get('destination');
                    if (destParam) {
                        destination = destParam;
                    } else {
                        // fallback: extrai termo após /search/ se existir
                        const m = href.match(/\/search\/([^?#]+)/i);
                        if (m && m[1]) {
                            destination = decodeURIComponent(m[1]).replace(/\+/g, ' ');
                        } else {
                            // por fim usa a URL inteira como destino
                            destination = href;
                        }
                    }
                } catch (err) {
                    destination = this.href || this.getAttribute('data-href') || '';
                }
            }

            function openWithOrigin(lat, lng) {
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
                window.open(mapsUrl, '_blank');
            }

            function openFallback() {
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`;
                window.open(mapsUrl, '_blank');
            }

            // Usa geolocalização se disponível para incluir origin
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(function(pos) {
                    openWithOrigin(pos.coords.latitude, pos.coords.longitude);
                }, function(err) {
                    openFallback();
                }, { timeout: 10000, maximumAge: 0, enableHighAccuracy: true });
            } else {
                openFallback();
            }
        });
    });

    // Live tracking removido conforme solicitação — referências a #live-tracker foram excluídas
});