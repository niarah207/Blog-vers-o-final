// scroll-reveal.js — Animações de entrada ao rolar a página (Updated Yesterday)
//
// Como funciona:
// - Cada elemento marcado (revelar, revelar-esquerda, revelar-direita,
//   revelar-cima, revelar-cascata) anima UMA vez por carregamento da página.
//   Ao recarregar, o efeito acontece de novo.
// - A animação NUNCA bloqueia a rolagem: é apenas visual.
// - Se a pessoa rolar rápido, as animações ficam bem mais curtas para que o
//   conteúdo apareça quase imediatamente, sem sensação de travamento.
(function () {
    var SELETOR = '.revelar, .revelar-esquerda, .revelar-direita, .revelar-cima, .revelar-cascata';
    var elementos = document.querySelectorAll(SELETOR);
    if (!elementos.length) return;

    var raiz = document.documentElement;

    // Durações: normal x rolagem rápida
    var DUR_NORMAL = '0.7s';
    var DUR_RAPIDA = '0.2s';
    var PASSO_NORMAL = '0.07s';
    var PASSO_RAPIDO = '0.02s';

    // Se a pessoa prefere menos movimento, mostra tudo direto.
    var semMovimento = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function mostrarTudo() {
        elementos.forEach(function (el) {
            el.classList.add('ativo');
        });
    }

    if (semMovimento || !('IntersectionObserver' in window)) {
        mostrarTudo();
        return;
    }

    // ----------------------------------------------------------------------
    // Detecção de velocidade de rolagem
    // ----------------------------------------------------------------------
    var ultimoY = window.pageYOffset;
    var ultimoTempo = Date.now();
    var rapido = false;
    var voltarAoNormal;

    function aplicarVelocidade(estaRapido) {
        if (estaRapido === rapido) return;
        rapido = estaRapido;
        raiz.style.setProperty('--duracao-revelar', rapido ? DUR_RAPIDA : DUR_NORMAL);
        raiz.style.setProperty('--passo-cascata', rapido ? PASSO_RAPIDO : PASSO_NORMAL);
    }

    function medirRolagem() {
        var agora = Date.now();
        var y = window.pageYOffset;
        var tempo = agora - ultimoTempo;

        if (tempo > 0) {
            // pixels por milissegundo
            var velocidade = Math.abs(y - ultimoY) / tempo;
            // acima de ~1.4 px/ms a rolagem é considerada rápida
            if (velocidade > 1.4) {
                aplicarVelocidade(true);
                clearTimeout(voltarAoNormal);
                voltarAoNormal = setTimeout(function () {
                    aplicarVelocidade(false);
                }, 400);
            }
        }

        ultimoY = y;
        ultimoTempo = agora;
    }

    window.addEventListener('scroll', medirRolagem, { passive: true });

    // ----------------------------------------------------------------------
    // Revelação dos elementos
    // ----------------------------------------------------------------------
    var observer = new IntersectionObserver(function (entradas, obs) {
        entradas.forEach(function (entrada) {
            if (!entrada.isIntersecting) return;
            entrada.target.classList.add('ativo');
            obs.unobserve(entrada.target); // anima só uma vez por carregamento
        });
    }, {
        // Começa um pouco antes de entrar totalmente na tela, para que o
        // elemento já esteja visível quando a pessoa chegar nele.
        threshold: 0,
        rootMargin: '0px 0px -12% 0px'
    });

    elementos.forEach(function (el) {
        // Elementos que já passaram da tela (rolagem muito rápida, link com
        // âncora, recarregar no meio da página) aparecem na hora, sem esperar.
        var caixa = el.getBoundingClientRect();
        if (caixa.top < window.innerHeight * 0.9) {
            el.classList.add('ativo');
            return;
        }
        observer.observe(el);
    });
})();