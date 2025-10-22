/* -------- DATOS (sin tocar mucho, puedes agregar/editar productos aquí) -------- */
const productos = [
    { id:1, nombre:"Servilletero de Reno Juguetón", titulo:"Amigo del Bosque en tu Mesa", descripcionCorta:"Adorable reno de fieltro con bufanda verde.", descripcion:"Dale un toque tierno y rústico a tu decoración con este adorable reno de fieltro. Su diseño amigable y su suave bufanda verde lo convierten en el detalle perfecto para una cena navideña.", imagen:"images/servilletero1.jpg", precio:"S/ 15.00" },
    { id:2, nombre:"Servilletero de Santa Claus", titulo:"La Magia de Santa", descripcionCorta:"Brillante Santa Claus con acabado holográfico.", descripcion:"La alegría de la Navidad llega a tu mesa con este brillante servilletero de Santa Claus. Su acabado holográfico y su sonrisa amigable capturan la esencia mágica de la temporada.", imagen:"images/servilletero2.jpg", precio:"S/ 18.00" },
    { id:3, nombre:"Servilletero de Estrella y Bayas", titulo:"Estrella de Belén Rústica", descripcionCorta:"Madera natural con estrella calada y bayas rojas.", descripcion:"Un diseño que combina la calidez de la madera con el toque festivo de las bayas rojas. Perfecto para una Navidad tradicional.", imagen:"images/servilletero3.jpg", precio:"S/ 16.00" },
    { id:4, nombre:"Servilletero de Árbol de Madera", titulo:"Bosque Navideño Iluminado", descripcionCorta:"Pino de madera decorado con cristales rojos.", descripcion:"Este servilletero aporta un estilo sofisticado y natural, ideal para mesas que buscan sencillez y brillo sutil.", imagen:"images/servilletero4.jpg", precio:"S/ 17.00" },
    { id:5, nombre:"Servilletero de Casita de Jengibre", titulo:"Dulce Hogar Navideño", descripcionCorta:"Casita con purpurina dorada, festiva y divertida.", descripcion:"Endulza tu decoración con esta encantadora casita de jengibre cubierta de purpurina dorada.", imagen:"images/servilletero5.jpg", precio:"S/ 19.00" },
    { id:6, nombre:"Servilletero de Árbol Clásico", titulo:"Espíritu Festivo en Miniatura", descripcionCorta:"Árbol tradicional con guirnaldas y estrella.", descripcion:"Pequeño árbol con guirnaldas que trae el espíritu festivo a tu mesa.", imagen:"images/servilletero6.jpg", precio:"S/ 16.00" },
    { id:7, nombre:"Servilletero de Flor Dorada", titulo:"Elegancia Floral Dorada", descripcionCorta:"Diseño metálico en forma de flor dorada con centro rojo brillante.", descripcion:"Detalle de distinción y glamour para cenas sofisticadas.", imagen:"images/servilletero7.jpg", precio:"S/ 20.00" },
    { id:8, nombre:"Servilletero Lazo Escocés y Piñas", titulo:"Abrazo Invernal", descripcionCorta:"Lazo de tartán con piñas y ramas de pino.", descripcion:"Evoca el encanto de una cabaña en invierno con este servilletero rústico.", imagen:"images/servilletero8.jpg", precio:"S/ 17.00" }
];
const WHATSAPP_NUMBER = "949823528"; // ajusta aquí tu número

/* ----------------- GENERAR PÁGINAS ----------------- */
function generarPaginas(){
    const flipbook = $('#flipbook');
    flipbook.empty();

    // Portada
    const portada = $(`
        <div class="page portada" data-page-type="cover">
            <div class="portada-content">
                <h1>Catálogo Navideño 2025</h1>
                <div class="portada-decor"></div>
                <h2>Servilleteros Artesanales</h2>
            </div>
            <div class="sparkles" aria-hidden="true"></div>
        </div>`);
    flipbook.append(portada);

    // Productos (2 por página en desktop, 1 por página en mobile)
    const isMobile = window.innerWidth <= 768;
    if(isMobile){
        productos.forEach(p => {
            const page = $(`
                <div class="page">
                    <div class="productos-container" style="grid-template-columns:1fr;">
                        <div class="producto-card" data-id="${p.id}" tabindex="0">
                            <img loading="lazy" src="${p.imagen}" alt="${p.nombre}" class="producto-imagen" onerror="this.src='https://via.placeholder.com/600x400?text=Imagen'">
                            <div class="producto-info">
                                <div class="producto-titulo">${p.nombre}</div>
                                <div class="producto-descripcion">${p.descripcionCorta}</div>
                                <div class="producto-footer">
                                    <div class="producto-precio">${p.precio}</div>
                                    <button class="btn-ver-detalles">Ver detalles</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`);
            flipbook.append(page);
        });
    } else {
        for(let i=0;i<productos.length;i+=2){
            const pair = productos.slice(i,i+2);
            let html = `<div class="page"><div class="productos-container">`;
            pair.forEach(p => {
                html += `
                <div class="producto-card" data-id="${p.id}" tabindex="0">
                    <img loading="lazy" src="${p.imagen}" alt="${p.nombre}" class="producto-imagen" onerror="this.src='https://via.placeholder.com/600x400?text=Imagen'">
                    <div class="producto-info">
                        <div class="producto-titulo">${p.nombre}</div>
                        <div class="producto-descripcion">${p.descripcionCorta}</div>
                        <div class="producto-footer">
                            <div class="producto-precio">${p.precio}</div>
                            <button class="btn-ver-detalles">Ver detalles</button>
                        </div>
                    </div>
                </div>`;
            });
            html += `</div></div>`;
            flipbook.append(html);
        }
    }

    // Cierre
    const cierre = $(`
        <div class="page cierre" data-page-type="back">
            <h2>Gracias por visitar nuestro catálogo</h2>
            <div class="portada-decor" style="margin:18px auto"></div>
            <p>Esperamos que encuentres el servilletero perfecto para tu mesa navideña. ¡Felices fiestas!</p>
        </div>`);
    flipbook.append(cierre);
}

/* ----------------- INICIALIZAR TURN.JS CON PAGE CURL MEJORADO ----------------- */
function inicializarFlipbook(){
    const isMobile = window.innerWidth <= 768;
    const $flip = $('#flipbook');

    // destroy previo si existe
    try{ if($flip.data('turn')) $flip.turn('destroy'); } catch(e){}

    $flip.turn({
        width: isMobile ? Math.min(420, window.innerWidth - 32) : 1200,
        height: isMobile ? 640 : 640,
        autoCenter: true,
        display: isMobile ? 'single' : 'double',
        gradients: !isMobile,  // Desactivar gradientes en móvil
        acceleration: true,
        elevation: isMobile ? 0 : 50,  // Sin elevación en móvil
        duration: 800,
        pages: $('#flipbook .page').length,
        when: {
            turning: function(e, page, view){
                $('#page-indicator').fadeIn(180);
                $('#current-page').text(page);
            },
            turned: function(e,page,view){
                actualizarBotones();
                animatePageContent(page);
                setTimeout(()=>$('#page-indicator').fadeOut(900),1200);
            },
            start: function(e, pageObject, corner){
                // Sin animaciones extra que interfieran
            },
            end: function(e, pageObject, corner){
                // Sin animaciones extra que interfieran
            }
        }
    });

    // indicador total
    $('#total-pages').text($flip.turn('pages') || $('#flipbook .page').length);
    $('#current-page').text(1);
    
    // Remover sombras en móvil después de la inicialización
    if (isMobile) {
        setTimeout(() => {
            $('#flipbook').find('.turn-page-wrapper, .turn-page').css('box-shadow', 'none');
            $('#flipbook').css('box-shadow', 'none');
            // Remover cualquier elemento de sombra que Turn.js haya creado
            $('#flipbook').find('[class*="shadow"], [id*="shadow"]').remove();
        }, 100);
    }

    // animar portada chispas
    generarSparkles();

    // animación inicial de la primera página
    animatePageContent(1);

    // swipe móvil (mejorado)
    if(isMobile){
        let startX = 0, startY = 0, isTouch=false;
        $flip.on('touchstart', function(e){ startX=e.changedTouches[0].clientX; startY=e.changedTouches[0].clientY; isTouch=true; });
        $flip.on('touchend', function(e){
            if(!isTouch) return;
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const dx = endX - startX, dy = endY - startY;
            if(Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40){
                if(dx < 0) $flip.turn('next'); else $flip.turn('previous');
            }
            isTouch=false;
        });
    }
}

/* ----------------- ANIMACIÓN DE CONTENIDO POR PÁGINA (GSAP) ----------------- */
function animatePageContent(page){
    const $page = $('#flipbook .page').eq(page-1);
    if(!$page.length) return;

    // Animar elementos internos con efecto suave
    gsap.killTweensOf($page.find('*'));
    gsap.fromTo($page.find('img, .producto-titulo, .producto-descripcion, .btn-ver-detalles'),
        {y:15, autoAlpha:0},
        {y:0, autoAlpha:1, duration:0.5, stagger:0.06, ease:'power2.out'});
}

/* ----------------- BOTONES Y TECLADO ----------------- */
function actualizarBotones(){
    const $flip = $('#flipbook');
    const currentPage = $flip.turn('page') || 1;
    const total = $flip.turn('pages') || $('#flipbook .page').length;
    $('#current-page').text(currentPage);
    $('#total-pages').text(total);
    $('#prev-btn').prop('disabled', currentPage === 1);
    $('#next-btn').prop('disabled', currentPage === total);
}
$('#prev-btn').on('click', ()=> $('#flipbook').turn('previous'));
$('#next-btn').on('click', ()=> $('#flipbook').turn('next'));

$(document).on('keydown', function(e){
    if($('#modal').is(':visible')) return;
    if(e.key === 'ArrowLeft') $('#flipbook').turn('previous');
    if(e.key === 'ArrowRight') $('#flipbook').turn('next');
});

/* ----------------- EVENTOS DE INTERACCIÓN EN TARJETAS Y MODAL ----------------- */
$(document).on('click', '.producto-card, .btn-ver-detalles', function(e){
    e.stopPropagation();
    const $card = $(this).closest('.producto-card');
    const id = $card.data('id');
    abrirModalProducto(id);
});
$(document).on('keypress', '.producto-card', function(e){
    if(e.key === 'Enter' || e.key === ' ') { $(this).trigger('click'); }
});

function abrirModalProducto(id){
    const p = productos.find(x=>x.id===id);
    if(!p) return;
    $('#modal-imagen').attr('src', p.imagen).attr('alt', p.nombre).on('error', function(){ this.src='https://via.placeholder.com/800x600?text=Imagen' });
    $('#modal-nombre').text(p.nombre);
    $('#modal-titulo').text(p.titulo);
    $('#modal-descripcion').text(p.descripcion);
    $('#modal-precio').text(p.precio);
    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}?&text=${encodeURIComponent('Hola quiero más información sobre: ' + p.nombre)}`;
    $('#modal-whatsapp').attr('href', url);

    $('#modal').fadeIn(200).attr('aria-hidden','false');
    $('body').css('overflow','hidden');
    // animaciones internas suaves
    gsap.fromTo('.modal-content', {y:30, autoAlpha:0}, {duration:0.45, y:0, autoAlpha:1, ease:'power3.out'});
}

$('#modal-btn-cerrar, #close-modal').on('click', function(){
    cerrarModal();
});
$('#modal').on('click', function(e){
    if(e.target.id === 'modal') cerrarModal();
});
function cerrarModal(){
    $('#modal').fadeOut(180).attr('aria-hidden','true');
    $('body').css('overflow','auto');
}

/* ----------------- CHISPAS EN PORTADA (sparkles) ----------------- */
function generarSparkles(){
    const $sparkles = $('.portada .sparkles');
    if(!$sparkles.length) return;
    $sparkles.empty();
    const count = 20;
    for(let i=0;i<count;i++){
        const s = $('<div class="sparkle"></div>');
        $sparkles.append(s);
        const left = Math.random()*100;
        const top = Math.random()*100;
        s.css({left:left+'%', top:top+'%'});
        // animar con GSAP en loop
        const delay = Math.random()*2;
        gsap.to(s, {opacity:1, scale:1.6, duration:0.8, ease:'sine.inOut', repeat:-1, yoyo:true, delay:delay, repeatDelay:Math.random()*2});
    }
}

/* ----------------- NIEVE (canvas) ----------------- */
(function initSnow(){
    const canvas = document.getElementById('snow-canvas');
    const ctx = canvas.getContext('2d');
    let w=canvas.width=innerWidth, h=canvas.height=innerHeight;
    let flakes = [];
    const flakeCount = Math.round((w*h)/70000); // ajustar densidad según tamaño

    function reset(){
        w=canvas.width=innerWidth; h=canvas.height=innerHeight;
        flakes = [];
        for(let i=0;i<flakeCount;i++){
            flakes.push({
                x: Math.random()*w,
                y: Math.random()*h,
                r: 1 + Math.random()*3,
                d: Math.random()*flapConst(),
                vx: (Math.random()-0.5)*0.5,
                vy: 0.3 + Math.random()*1.2
            });
        }
    }
    function flapConst(){ return 2 + Math.random()*2; }
    function draw(){
        ctx.clearRect(0,0,w,h);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        for(let i=0;i<flakes.length;i++){
            const f = flakes[i];
            ctx.moveTo(f.x, f.y);
            ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
        }
        ctx.fill();
        update();
        requestAnimationFrame(draw);
    }
    function update(){
        for(let i=0;i<flakes.length;i++){
            const f = flakes[i];
            f.x += f.vx + Math.sin(Date.now()/1000 + f.d)*0.3;
            f.y += f.vy;
            if(f.y > h + 10){
                f.y = -10; f.x = Math.random()*w;
            }
            if(f.x < -10) f.x = w + 10;
            if(f.x > w + 10) f.x = -10;
        }
    }
    window.addEventListener('resize', ()=>{
        reset();
    });
    reset(); draw();
})();

/* ----------------- Inicialización y manejo de resize (mantener página actual) ----------------- */
let lastPage = 1;
$(window).on('resize', function(){
    try{ lastPage = $('#flipbook').turn('page') || lastPage } catch(e){}
    setTimeout(()=>{ generarPaginas(); inicializarFlipbook(); try{ $('#flipbook').turn('page', lastPage); } catch(e){} }, 160);
});

$(document).ready(function(){
    generarPaginas();
    inicializarFlipbook();
    // mejorar accesibilidad: foco en flipbook
    $('#flipbook').attr('tabindex',0);
});
