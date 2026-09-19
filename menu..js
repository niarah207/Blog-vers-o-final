// menu.js — Menu hambúrguer + navegação ativa (Updated Yesterday)
// Usado em todas as páginas do site para manter o comportamento consistente.
//
// OBS: este arquivo precisa se chamar exatamente "menu.js", pois é esse o
// nome que todas as páginas (.html) carregam via <script src="menu.js">.
(function () {

    // ------------------------------------------------------------------
    // MENU HAMBÚRGUER (telas menores)
    // ------------------------------------------------------------------
    const btn = document.getElementById('btn-hamburguer');
    const menu = document.getElementById('menu-mobile');
    const overlay = document.getElementById('overlay-menu-mobile');

    if (btn && menu && overlay) {
        function abrirMenu() {
            menu.classList.add('aberto');
            overlay.classList.add('aberto');
            btn.classList.add('ativo');
            btn.setAttribute('aria-expanded', 'true');
            menu.setAttribute('aria-hidden', 'false');
            document.body.classList.add('menu-bloqueado');
        }

        function fecharMenu() {
            menu.classList.remove('aberto');
            overlay.classList.remove('aberto');
            btn.classList.remove('ativo');
            btn.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('menu-bloqueado');
        }

        btn.addEventListener('click', function () {
            if (menu.classList.contains('aberto')) {
                fecharMenu();
            } else {
                abrirMenu();
            }
        });

        overlay.addEventListener('click', fecharMenu);

        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', fecharMenu);
        });

        document.addEventListener('keydown', function (evento) {
            if (evento.key === 'Escape') fecharMenu();
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 992) fecharMenu();
        });
    }

    // ------------------------------------------------------------------
    // LINK DE NAVEGAÇÃO "ATIVO" (cabeçalho — apenas telas maiores)
    // Ao clicar em uma opção do menu (Sobre Nós, Objetivo, Funcionalidades,
    // Contato), o link fica marcado — a underline dourada "trava" — indicando
    // qual seção foi acessada, além de rolar até ela normalmente.
    // ------------------------------------------------------------------
    var linksMenu = document.querySelectorAll('.link-menu');

    function marcarAtivo(linkClicado) {
        linksMenu.forEach(function (link) {
            link.classList.remove('ativo');
        });
        linkClicado.classList.add('ativo');
    }

    linksMenu.forEach(function (link) {
        link.addEventListener('click', function () {
            marcarAtivo(link);
        });
    });

    // Ao abrir a página já com uma âncora na URL (ex.: index.html#objetivo,
    // ou vindo de outra página como creditos.html → index.html#...),
    // marca o link correspondente como ativo assim que a página carrega.
    if (window.location.hash) {
        linksMenu.forEach(function (link) {
            var partesHref = link.getAttribute('href').split('#');
            var hashDoLink = partesHref[1] ? ('#' + partesHref[1]) : '';
            if (hashDoLink && hashDoLink === window.location.hash) {
                marcarAtivo(link);
            }
        });
    }
})();