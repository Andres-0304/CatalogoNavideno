/* =====================================================
   CATÁLOGO NAVIDAD EN TU MESA - SCRIPT PRINCIPAL
   Versión optimizada 2025.2
   - Soporte completo para modo "una sola página" en móvil
   - Comportamiento tipo libro físico
   - Mismo diseño responsive y compatibilidad total
===================================================== */

// Security Hardening: Anti-tampering & Credential Protection
(function() {
    'use strict';
    
    // Anti-debugging protection
    let devtools = {open: false, orientation: null};
    const threshold = 160;
    
    setInterval(function() {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                console.clear();
                console.log('%cSecurity Alert: Developer tools detected', 'color: red; font-size: 20px;');
            }
        } else {
            devtools.open = false;
        }
    }, 500);
    
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Disable F12, Ctrl+Shift+I, Ctrl+U
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.key === 'u')) {
            e.preventDefault();
            return false;
        }
    });
    
    // Clear console on focus
    window.addEventListener('focus', function() {
        console.clear();
    });
})();

// Array de productos (se cargará desde Firebase)
let productos = [];

let flipbook = null;
let paginaActual = 0;
let totalPaginas = 0;
let esMobile = false;

// Elementos DOM
const flipbookContainer = document.getElementById('flipbook');
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const paginaActualSpan = document.getElementById('pagina-actual');
const totalPaginasSpan = document.getElementById('total-paginas');
const modal = document.getElementById('modal-producto');
const modalClose = document.getElementById('modal-close');

/* =====================================================
   FIREBASE INTEGRATION
===================================================== */

// Función para cargar productos desde Firebase
async function cargarProductosFirebase() {
    try {
        console.log('Cargando productos desde Firebase...');
        
        if (!window.db || !window.getDocs || !window.collection) {
            console.error('Firebase no está disponible');
            return false;
        }
        
        const productosRef = window.collection(window.db, 'productos');
        const snapshot = await window.getDocs(productosRef);
        
        productos = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            productos.push({
                id: doc.id,
                nombre: data.nombre,
                desc: data.desc,
                precio: data.precio,
                img: data.img,
                incluye: data.incluye,
                videos: data.videos || null // Campo opcional para videos
            });
        });
        
        console.log(`Productos cargados desde Firebase: ${productos.length}`);
        console.log('Productos:', productos);
        
        return true;
    } catch (error) {
        console.error('Error cargando productos desde Firebase:', error);
        return false;
    }
}

// Función para configurar actualizaciones en tiempo real
function configurarActualizacionesTiempoReal() {
    if (!window.db || !window.onSnapshot || !window.collection) {
        console.log('Firebase no disponible para tiempo real');
        return;
    }
    
    try {
        const productosRef = window.collection(window.db, 'productos');
        window.onSnapshot(productosRef, (snapshot) => {
            console.log('Actualización en tiempo real detectada');
            
            // Verificar si realmente hay cambios
            const nuevosProductos = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                nuevosProductos.push({
                    id: doc.id,
                    nombre: data.nombre,
                    desc: data.desc,
                    precio: data.precio,
                    img: data.img,
                    incluye: data.incluye,
                    videos: data.videos || null
                });
            });
            
            // Solo regenerar si hay cambios reales
            if (JSON.stringify(nuevosProductos) !== JSON.stringify(productos)) {
                console.log('Cambios detectados, regenerando catálogo...');
                productos = nuevosProductos;
                regenerarCatalogo();
            } else {
                console.log('Sin cambios detectados, manteniendo catálogo actual');
            }
        });
        console.log('Actualizaciones en tiempo real configuradas');
    } catch (error) {
        console.error('Error configurando tiempo real:', error);
    }
}

/* =====================================================
   INICIALIZACIÓN
===================================================== */
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Iniciando Catálogo Navidad en tu Mesa...');
    
    // Esperar a que Firebase esté disponible
    let firebaseReady = false;
    let attempts = 0;
    const maxAttempts = 50; // 5 segundos máximo
    
    while (!firebaseReady && attempts < maxAttempts) {
        if (window.db && window.getDocs && window.collection) {
            firebaseReady = true;
        } else {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
    }
    
    if (!firebaseReady) {
        console.error('Firebase no se cargó en el tiempo esperado');
        return;
    }
    
    // Cargar productos desde Firebase
    const productosCargados = await cargarProductosFirebase();
    
    if (!productosCargados || productos.length === 0) {
        console.error('No se pudieron cargar los productos');
        return;
    }
    
    detectarDispositivo();
    generarPaginas();
    
    if (!esMobile) {
        // Solo inicializar flipbook para desktop
        setTimeout(() => {
            inicializarFlipbook();
        }, 100);
    }
    
    configurarEventos();
    configurarActualizacionesTiempoReal();
    
    console.log('Catálogo inicializado correctamente con Firebase');
});

/* =====================================================
   DETECCIÓN DE DISPOSITIVO
===================================================== */
function detectarDispositivo() {
    const anchoVentana = window.innerWidth;
    esMobile = anchoVentana <= 768;
    console.log(`Ancho de ventana: ${anchoVentana}px - Dispositivo: ${esMobile ? 'MÓVIL' : 'DESKTOP'}`);
}

/* =====================================================
   GENERACIÓN DE PÁGINAS
===================================================== */
function generarPaginas() {
    console.log('Generando páginas del catálogo...');
    console.log('Dispositivo móvil detectado:', esMobile);
    
    if (esMobile) {
        // Cargar catálogo móvil completamente separado
        cargarCatalogoMovil();
        return;
    }
    
    // CATÁLOGO DESKTOP ORIGINAL (sin modificaciones)
    const productosPorPagina = 2;
    const paginasProductos = Math.ceil(productos.length / productosPorPagina);
    totalPaginas = paginasProductos + 1; // +1 por la portada
    
    console.log(`Catálogo DESKTOP: ${productosPorPagina} productos por página`);
    console.log(`Total páginas: ${totalPaginas}`);
    
    // Actualizar contador
    totalPaginasSpan.textContent = totalPaginas;
    
    // Limpiar contenedor
    flipbookContainer.innerHTML = '';
    
    // Generar portada
    generarPortada();
    
    // Generar páginas de productos
    for (let i = 0; i < paginasProductos; i++) {
        const inicio = i * productosPorPagina;
        const fin = Math.min(inicio + productosPorPagina, productos.length);
        const productosParaPagina = productos.slice(inicio, fin);
        
        console.log(`Página ${i + 2}: ${productosParaPagina.length} productos`, productosParaPagina.map(p => p.nombre));
        
        generarPaginaProductos(productosParaPagina, i + 2); // +2 porque empieza después de la portada
    }
    
    console.log(`Generadas ${totalPaginas} páginas`);
}

/* =====================================================
   CATÁLOGO MÓVIL COMPLETAMENTE SEPARADO
===================================================== */
function cargarCatalogoMovil() {
    console.log('Cargando catálogo móvil separado...');
    
    // Ocultar elementos del catálogo desktop
    const flipbookContainer = document.getElementById('flipbook-container');
    if (flipbookContainer) {
        flipbookContainer.style.display = 'none';
    }
    
    // Crear contenedor móvil
    const mobileContainer = document.createElement('div');
    mobileContainer.id = 'mobile-catalog-container';
    mobileContainer.className = 'mobile-catalog-container';
    
    // Insertar en el contenedor principal
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        mainContainer.appendChild(mobileContainer);
        
        // Generar las 10 hojas móviles
        generarHojasMoviles(mobileContainer);
        
        // Configurar navegación móvil
        configurarNavegacionMovil();
        
        console.log('Catálogo móvil cargado correctamente');
    } else {
        console.error('No se encontró el contenedor principal');
    }
}

function generarHojasMoviles(container) {
    const totalHojas = 1 + productos.length + 1; // portada + productos + contraportada
    console.log(`Generando ${totalHojas} hojas individuales para móvil...`);
    
    // Hoja 1: Portada
    generarHojaPortada(container);
    
    // Hojas 2 a (1 + productos.length): Productos individuales
    for (let i = 0; i < productos.length; i++) {
        generarHojaProducto(productos[i], i + 2, container);
    }
    
    // Última hoja: Contraportada
    generarHojaContraportada(container);
    
    // Verificar que se generaron las hojas
    const hojasGeneradas = container.querySelectorAll('.hoja-movil');
    console.log(`Hojas generadas: ${hojasGeneradas.length} de ${totalHojas} esperadas`);
    
    if (hojasGeneradas.length === 0) {
        console.error('No se generaron hojas móviles');
    } else if (hojasGeneradas.length !== totalHojas) {
        console.warn(`Advertencia: Se generaron ${hojasGeneradas.length} hojas pero se esperaban ${totalHojas}`);
    }
}

function generarHojaPortada(container) {
    const hoja = document.createElement('div');
    hoja.className = 'hoja-movil pagina pagina-portada';
    
    hoja.innerHTML = `
        <div class="portada-decoracion-fondo">
            <div class="copo-nieve copo-1"></div>
            <div class="copo-nieve copo-2"></div>
            <div class="copo-nieve copo-3"></div>
            <div class="copo-nieve copo-4"></div>
            <div class="copo-nieve copo-5"></div>
            <div class="copo-nieve copo-6"></div>
        </div>
        
        <div class="portada-content">
            <div class="portada-decoracion-superior">
                <div class="estrella-decorativa estrella-izq"></div>
                <div class="ramas-pino ramas-superior"></div>
                <div class="estrella-decorativa estrella-der"></div>
            </div>
            
            <div class="portada-titulo-container">
                <h1 class="portada-titulo">Navidad en tu Mesa</h1>
                <div class="titulo-underline"></div>
            </div>
            
            <p class="portada-subtitulo">Conjuntos exclusivos de servilletas y aros servilleteros</p>
            
            <div class="portada-elementos-centrales">
                <div class="campana-izq"></div>
                <div class="portada-año">Catálogo 2025</div>
                <div class="campana-der"></div>
            </div>
            
            <div class="portada-decoracion-inferior">
                <div class="ramas-pino ramas-inferior"></div>
                <div class="texto-premium">EDICIÓN PREMIUM</div>
            </div>
            
            <div class="portada-borde-decorativo"></div>
        </div>
    `;
    container.appendChild(hoja);
}

function generarHojaProducto(producto, numeroHoja, container) {
    const hoja = document.createElement('div');
    hoja.className = 'hoja-movil hoja-producto';
    hoja.innerHTML = `
        <div class="hoja-contenido">
            <div class="hoja-header">
                <h2 class="hoja-titulo">${producto.nombre}</h2>
            </div>
            
            <div class="hoja-galeria">
                <div class="hoja-galeria-contenedor">
                    <div class="hoja-galeria-item active" data-type="image">
                <img src="${producto.img}" alt="${producto.nombre}" loading="lazy" onerror="manejarErrorImagen(this)">
                <div class="hoja-overlay"></div>
                    </div>
                    ${producto.videos ? `
                    <div class="hoja-galeria-item" data-type="video">
                        <video controls preload="metadata" muted>
                            <source src="${producto.videos}" type="video/mp4">
                            Tu navegador no soporta videos.
                        </video>
                        <div class="hoja-overlay"></div>
                    </div>
                    ` : ''}
                </div>
                ${producto.videos ? `
                <div class="hoja-galeria-indicadores">
                    <span class="hoja-galeria-dot active" data-index="0" onclick="cambiarHojaGaleria(this, 0)"></span>
                    <span class="hoja-galeria-dot" data-index="1" onclick="cambiarHojaGaleria(this, 1)"></span>
                </div>
                ` : ''}
            </div>
            
            <div class="hoja-info">
                <p class="hoja-descripcion">${producto.desc}</p>
                <div class="hoja-incluye">
                    <strong>Incluye:</strong> ${producto.incluye}
                </div>
                <div class="hoja-precio">
                    <span class="precio-valor">${producto.precio}</span>
                </div>
            </div>
            
            <div class="hoja-acciones">
                <button class="hoja-btn-whatsapp" onclick="abrirWhatsAppDirecto('${producto.id}')">
                    <span class="whatsapp-icon"></span>
                    Consultar por WhatsApp
                </button>
            </div>
        </div>
    `;
    container.appendChild(hoja);
}

function generarHojaContraportada(container) {
    const hoja = document.createElement('div');
    hoja.className = 'hoja-movil hoja-contraportada';
    hoja.innerHTML = `
        <div class="hoja-contenido">
            <div class="contraportada-content">
                <div class="contraportada-titulo">
                    <h2>¡Gracias por elegirnos!</h2>
                </div>
                
                <div class="contraportada-mensaje">
                    <p>Esperamos que hayas disfrutado de nuestro catálogo de conjuntos navideños exclusivos.</p>
                    <p>Cada pieza está diseñada con amor y cuidado para hacer de tu mesa navideña un lugar especial.</p>
                </div>
                
                <div class="contraportada-contacto">
                    <h3>Contacto</h3>
                    <div class="contacto-info">
                        <div class="contacto-item">
                            <span class="contacto-icon"></span>
                            <span>WhatsApp: +51 949 823 528</span>
                        </div>
                        <div class="contacto-item">
                            <span class="contacto-icon"></span>
                            <span>Email: navidad@tumesa.com</span>
                        </div>
                    </div>
                </div>
                
                <div class="contraportada-footer">
                    <p class="footer-texto">Navidad en tu Mesa - Catálogo 2025</p>
                    <p class="footer-edicion">Edición Premium</p>
                </div>
            </div>
        </div>
    `;
    container.appendChild(hoja);
}

function generarPortada() {
    const portada = document.createElement('div');
    portada.className = 'pagina pagina-portada';
    portada.innerHTML = `
        <div class="portada-decoracion-fondo">
            <div class="copo-nieve copo-1"></div>
            <div class="copo-nieve copo-2"></div>
            <div class="copo-nieve copo-3"></div>
            <div class="copo-nieve copo-4"></div>
            <div class="copo-nieve copo-5"></div>
            <div class="copo-nieve copo-6"></div>
        </div>
        
        <div class="portada-content">
            <div class="portada-decoracion-superior">
                <div class="estrella-decorativa estrella-izq"></div>
                <div class="ramas-pino ramas-superior"></div>
                <div class="estrella-decorativa estrella-der"></div>
            </div>
            
            <div class="portada-titulo-container">
                <h1 class="portada-titulo">Navidad en tu Mesa</h1>
                <div class="titulo-underline"></div>
            </div>
            
            <p class="portada-subtitulo">Conjuntos exclusivos de servilletas y aros servilleteros</p>
            
            <div class="portada-elementos-centrales">
                <div class="campana-izq"></div>
                <div class="portada-año">Catálogo 2025</div>
                <div class="campana-der"></div>
            </div>
            
            <div class="portada-decoracion-inferior">
                <div class="ramas-pino ramas-inferior"></div>
                <div class="texto-premium">EDICIÓN PREMIUM</div>
            </div>
            
            <div class="portada-borde-decorativo"></div>
        </div>
    `;
    flipbookContainer.appendChild(portada);
}

function generarPaginaProductos(productosParaPagina, numeroPagina) {
    const pagina = document.createElement('div');
    pagina.className = 'pagina pagina-productos';
    
    console.log(`Generando página ${numeroPagina} con ${productosParaPagina.length} productos para ${esMobile ? 'MÓVIL' : 'DESKTOP'}`);
    
    const titulosSeccion = [
        'Tradición Navideña',
        'Elegancia Festiva', 
        'Magia del Hogar',
        'Espíritu Navideño',
        'Colección Premium',
        'Decoración Especial',
        'Ambiente Festivo',
        'Navidad Única'
    ];
    
    const indicePagina = numeroPagina - 2;
    const tituloSeccion = titulosSeccion[indicePagina] || 'Navidad Especial';
    
    const gridClass = esMobile ? 'grid-mobile' : 'grid-desktop';
    console.log(`Aplicando clase: ${gridClass} para ${productosParaPagina.length} productos`);
    
    pagina.innerHTML = `
        <div class="header-seccion">
            <h2 class="titulo-seccion">${tituloSeccion}</h2>
        </div>
        <div class="grid-productos ${gridClass}">
            ${productosParaPagina.map(producto => generarTarjetaProducto(producto)).join('')}
        </div>
    `;
    
    flipbookContainer.appendChild(pagina);
}

function generarTarjetaProducto(producto) {
    return `
        <div class="tarjeta-producto" onclick="abrirModalProducto('${producto.id}')">
            <div class="tarjeta-imagen">
                <img src="${producto.img}" alt="${producto.nombre}" loading="lazy" onerror="manejarErrorImagen(this)">
                <div class="overlay-gradient"></div>
            </div>
            <div class="tarjeta-info">
                <h3 class="producto-titulo">${producto.nombre}</h3>
                <p class="producto-descripcion">${producto.desc.substring(0, 120)}...</p>
                <div class="producto-footer">
                    <span class="producto-precio">${producto.precio}</span>
                </div>
            </div>
        </div>
    `;
}

/* =====================================================
   INICIALIZACIÓN DEL FLIPBOOK
===================================================== */
function inicializarFlipbook() {
    try {
        console.log('Inicializando StPageFlip...');
        
        if (typeof St === 'undefined') {
            console.error('StPageFlip no está disponible. Usando fallback...');
            usarFallbackCarrusel();
            return;
        }
        
        // Verificar que el contenedor existe y tiene contenido
        if (!flipbookContainer || flipbookContainer.children.length === 0) {
            console.error('Contenedor flipbook vacío o no existe');
            usarFallbackCarrusel();
            return;
        }
        
        // Destruir flipbook anterior si existe
        if (flipbook) {
            try {
                if (typeof flipbook.destroy === 'function') {
                    flipbook.destroy();
                }
            } catch (error) {
                console.log('Error al destruir flipbook anterior:', error);
            }
            flipbook = null;
        }
        
        flipbook = new St.PageFlip(flipbookContainer, {
            width: esMobile ? 360 : 600,
            height: esMobile ? 520 : 700,
            size: 'stretch',
            minWidth: 300,
            maxWidth: 800,
            minHeight: 400,
            maxHeight: 800,
            showCover: true,
            mobileScrollSupport: false,
            swipeDistance: esMobile ? 0 : 50,        // 👉 Deshabilitar swipe en móvil
            clickEventForward: true,
            usePortrait: esMobile,                 // 👉 En móvil: modo retrato
            display: esMobile ? "single" : "double", // 👉 1 página en móvil, 2 en desktop
            startPage: 0,
            drawShadow: true,
            flippingTime: esMobile ? 1000 : 800,  // 👉 Animación más lenta en móvil para efecto hoja
            useMouseEvents: !esMobile,             // 👉 Solo mouse en desktop
            showPageCorners: esMobile ? false : true, // 👉 Sin esquinas en móvil para efecto hoja limpia
            disableFlipByClick: esMobile,          // 👉 Deshabilitar click en móvil
            autoSize: true,
            maxShadowOpacity: esMobile ? 0.3 : 0.5, // 👉 Sombra más sutil en móvil
            shadowSides: esMobile ? 0.8 : 1.0,       // 👉 Sombra más pronunciada en móvil
            shadowFlip: esMobile ? 0.6 : 0.4         // 👉 Sombra durante el flip más visible
        });
        
        // Cargar páginas desde HTML generado
        const paginas = esMobile ? 
            document.querySelectorAll('.hoja-movil') : 
            document.querySelectorAll('.pagina');
            
        if (paginas.length === 0) {
            console.error('No se encontraron páginas para cargar');
            usarFallbackCarrusel();
            return;
        }
        
        flipbook.loadFromHTML(paginas);
        
        // Eventos
        flipbook.on('flip', function(e) {
            console.log('Página cambiada:', e.data);
            paginaActual = e.data;
            actualizarNavegacion();
            
            // Aplicar efectos de hoja en móvil
            if (esMobile) {
                aplicarEfectosHojaMovil();
            }
        });
        
        // Configurar navegación solo en áreas vacías (desktop)
        if (!esMobile) {
            configurarNavegacionDesktop();
        }
        
        flipbook.on('start', function(e) {
            console.log('Flipbook iniciado correctamente');
        });
        
        flipbook.on('changeOrientation', function(e) {
            console.log('Orientación cambiada:', e.data);
            setTimeout(() => {
                if (flipbook && typeof flipbook.updateState === 'function') flipbook.updateState();
            }, 100);
        });
        
        setTimeout(() => {
            if (flipbook && typeof flipbook.updateState === 'function') flipbook.updateState();
            console.log('Flipbook actualizado - gestos nativos habilitados');
        }, 200);
        
        console.log('Flipbook inicializado correctamente');
        
    } catch (error) {
        console.error('Error al inicializar flipbook:', error);
        usarFallbackCarrusel();
    }
}

/* =====================================================
   FALLBACK CARRUSEL CSS
===================================================== */
function usarFallbackCarrusel() {
    console.log('Usando carrusel CSS como fallback...');
    
    flipbookContainer.style.overflow = 'hidden';
    flipbookContainer.style.position = 'relative';
    
    const elementos = esMobile ? 
        flipbookContainer.querySelectorAll('.hoja-movil') : 
        flipbookContainer.querySelectorAll('.pagina');
    
    elementos.forEach((elemento, index) => {
        elemento.style.position = 'absolute';
        elemento.style.top = '0';
        elemento.style.left = `${index * 100}%`;
        elemento.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        elemento.style.transform = 'translateX(0)';
    });
    
    actualizarCarrusel();
}

function actualizarCarrusel() {
    const elementos = esMobile ? 
        flipbookContainer.querySelectorAll('.hoja-movil') : 
        flipbookContainer.querySelectorAll('.pagina');
    
    elementos.forEach((elemento, index) => {
        elemento.style.transform = `translateX(-${paginaActual * 100}%)`;
    });
}

/* =====================================================
   NAVEGACIÓN
===================================================== */
function configurarEventos() {
    // Botones de navegación
    btnAnterior.addEventListener('click', paginaAnterior);
    btnSiguiente.addEventListener('click', paginaSiguiente);
    
    // Eventos del modal
    modalClose.addEventListener('click', cerrarModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            cerrarModal();
        }
    });
    
    // Evento ESC para cerrar modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            cerrarModal();
        }
    });
    
    // Eventos de redimensionamiento
    window.addEventListener('resize', debounce(function() {
        const nuevoEsMobile = window.innerWidth <= 768;
        if (nuevoEsMobile !== esMobile) {
            console.log('Cambio de dispositivo detectado, regenerando...');
            esMobile = nuevoEsMobile;
            regenerarCatalogo();
        } else {
            // si solo cambió tamaño pero mismo modo, actualizar flipbook si existe
            if (flipbook && typeof flipbook.updateState === 'function') {
                setTimeout(() => flipbook.updateState(), 100);
            }
        }
    }, 300));
    
    // Eventos táctiles para efectos de hoja en móvil
    if (esMobile) {
        configurarGestosTactiles();
    }
}

/* Mantener la función original por compatibilidad */
function configurarEventosTactiles() {
    console.log('Usando eventos híbridos para mejor compatibilidad móvil');
}

/* =====================================================
   GESTOS TÁCTILES PARA EFECTOS DE HOJA
===================================================== */
function configurarGestosTactiles() {
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    
    const flipbookElement = document.getElementById('flipbook-container');
    
    // Eventos táctiles
    flipbookElement.addEventListener('touchstart', function(e) {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        isDragging = false;
    }, { passive: true });
    
    flipbookElement.addEventListener('touchmove', function(e) {
        if (!isDragging) {
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            // Detectar si es un deslizamiento horizontal
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
                isDragging = true;
                
                // Aplicar efecto visual durante el deslizamiento
                if (deltaX > 0 && paginaActual > 0) {
                    // Deslizando hacia la derecha (anterior)
                    aplicarEfectoColocarHoja();
                } else if (deltaX < 0 && paginaActual < totalPaginas - 1) {
                    // Deslizando hacia la izquierda (siguiente)
                    aplicarEfectoSacarHoja();
                }
            }
        }
    }, { passive: true });
    
    flipbookElement.addEventListener('touchend', function(e) {
        if (isDragging) {
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - startX;
            
            // Navegar según la dirección del deslizamiento
            if (deltaX > 50 && paginaActual > 0) {
                // Deslizamiento hacia la derecha - ir a anterior
                paginaAnterior();
            } else if (deltaX < -50 && paginaActual < totalPaginas - 1) {
                // Deslizamiento hacia la izquierda - ir a siguiente
                paginaSiguiente();
            }
        }
        
        isDragging = false;
    }, { passive: true });
    
    console.log('Gestos táctiles configurados para efectos de hoja');
}

/* =====================================================
   NAVEGACIÓN MÓVIL SEPARADA
===================================================== */
function configurarNavegacionMovil() {
    console.log('Configurando navegación móvil...');
    
    // Variables para el catálogo móvil
    let hojaActualMovil = 0;
    // Calcular total de hojas: 1 portada + productos + 1 contraportada
    const totalHojasMovil = 1 + productos.length + 1; // portada + productos + contraportada
    
    console.log(`Total de hojas móviles: ${totalHojasMovil} (1 portada + ${productos.length} productos + 1 contraportada)`);
    
    // Actualizar contador para móvil
    if (totalPaginasSpan) totalPaginasSpan.textContent = totalHojasMovil;
    if (paginaActualSpan) paginaActualSpan.textContent = hojaActualMovil + 1;
    
    // Mostrar/ocultar hojas
    function mostrarHojaMovil(index) {
        const hojas = document.querySelectorAll('#mobile-catalog-container .hoja-movil');
        console.log(`Mostrando hoja ${index + 1} de ${hojas.length} hojas disponibles`);
        
        hojas.forEach((hoja, i) => {
            if (i === index) {
                hoja.style.display = 'block';
                hoja.classList.add('hoja-activa');
                console.log(`Hoja ${i + 1} activada`);
            } else {
                hoja.style.display = 'none';
                hoja.classList.remove('hoja-activa');
            }
        });
    }
    
    // Navegación anterior
    function navegarAnteriorMovil() {
        if (hojaActualMovil > 0) {
            hojaActualMovil--;
            mostrarHojaMovil(hojaActualMovil);
            if (paginaActualSpan) paginaActualSpan.textContent = hojaActualMovil + 1;
            actualizarBotonesMovil();
        }
    }
    
    // Navegación siguiente
    function navegarSiguienteMovil() {
        if (hojaActualMovil < totalHojasMovil - 1) {
            hojaActualMovil++;
            mostrarHojaMovil(hojaActualMovil);
            if (paginaActualSpan) paginaActualSpan.textContent = hojaActualMovil + 1;
            actualizarBotonesMovil();
        }
    }
    
    // Actualizar estado de botones
    function actualizarBotonesMovil() {
        if (btnAnterior) btnAnterior.disabled = hojaActualMovil === 0;
        if (btnSiguiente) btnSiguiente.disabled = hojaActualMovil === totalHojasMovil - 1;
    }
    
    // Configurar eventos de botones
    if (btnAnterior) btnAnterior.onclick = navegarAnteriorMovil;
    if (btnSiguiente) btnSiguiente.onclick = navegarSiguienteMovil;
    
    // Mostrar primera hoja
    mostrarHojaMovil(0);
    actualizarBotonesMovil();
    
    // Configurar gestos táctiles para móvil (solo un sistema)
    configurarGestosMovil();
    
    // Configurar gestos de galería móvil
    configurarGestosGaleriaMovil();
    
    console.log('Navegación móvil configurada');
}

function configurarGestosMovil() {
    const mobileContainer = document.getElementById('mobile-catalog-container');
    if (!mobileContainer) {
        console.error('Contenedor móvil no encontrado');
        return;
    }
    
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let isHorizontalSwipe = false;
    
    console.log('Configurando gestos táctiles para móvil...');
    
    mobileContainer.addEventListener('touchstart', function(e) {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        isDragging = false;
        isHorizontalSwipe = false;
        console.log('Touch start:', startX, startY);
    }, { passive: true });
    
    mobileContainer.addEventListener('touchmove', function(e) {
        if (!isDragging) {
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            // Detectar si es un deslizamiento horizontal
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
                isDragging = true;
                isHorizontalSwipe = true;
                console.log('Deslizamiento horizontal detectado:', deltaX);
            } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 20) {
                isDragging = true;
                isHorizontalSwipe = false;
                console.log('Deslizamiento vertical detectado:', deltaY);
            }
        }
    }, { passive: true });
    
    mobileContainer.addEventListener('touchend', function(e) {
        if (isDragging && isHorizontalSwipe) {
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - startX;
            
            console.log('Touch end - deltaX:', deltaX);
            
            // Aumentar sensibilidad para evitar doble navegación
            if (deltaX > 80) {
                // Deslizar derecha - anterior
                console.log('Deslizar derecha - ir a anterior');
                document.getElementById('btn-anterior').click();
            } else if (deltaX < -80) {
                // Deslizar izquierda - siguiente
                console.log('Deslizar izquierda - ir a siguiente');
                document.getElementById('btn-siguiente').click();
            }
        }
        
        isDragging = false;
        isHorizontalSwipe = false;
    }, { passive: true });
    
    console.log('Gestos táctiles configurados correctamente');
}

/* =====================================================
   NAVEGACIÓN DESKTOP OPTIMIZADA
===================================================== */
function configurarNavegacionDesktop() {
    console.log('Configurando navegación desktop optimizada...');
    
    // Deshabilitar navegación por clic en productos
    const flipbookElement = document.getElementById('flipbook');
    if (!flipbookElement) return;
    
    flipbookElement.addEventListener('click', function(e) {
        // Verificar si el clic fue en un producto
        const producto = e.target.closest('.producto-tarjeta');
        if (producto) {
            console.log('Clic en producto - navegación deshabilitada');
            e.stopPropagation();
            return false;
        }
        
        // Verificar si el clic fue en el modal
        const modal = e.target.closest('.modal-overlay');
        if (modal) {
            console.log('Clic en modal - navegación deshabilitada');
            e.stopPropagation();
            return false;
        }
        
        // Solo permitir navegación en áreas vacías
        console.log('Clic en área vacía - navegación permitida');
    });
    
    console.log('Navegación desktop configurada');
}

/* =====================================================
   GESTOS DEL MODAL DESKTOP
===================================================== */
function configurarGestosModal() {
    const galeriaContenedor = document.querySelector('.galeria-contenedor');
    if (!galeriaContenedor) return;
    
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    
    // Eventos táctiles
    galeriaContenedor.addEventListener('touchstart', function(e) {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        isDragging = false;
    }, { passive: true });
    
    galeriaContenedor.addEventListener('touchmove', function(e) {
        if (!isDragging) {
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 15) {
                isDragging = true;
            }
        }
    }, { passive: true });
    
    galeriaContenedor.addEventListener('touchend', function(e) {
        if (isDragging) {
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - startX;
            
            if (deltaX > 50) {
                // Swipe derecha - anterior
                cambiarGaleriaItem(-1);
            } else if (deltaX < -50) {
                // Swipe izquierda - siguiente
                cambiarGaleriaItem(1);
            }
        }
        isDragging = false;
    }, { passive: true });
    
    // Eventos de ratón para desktop
    let mouseStartX = 0;
    let mouseIsDragging = false;
    
    galeriaContenedor.addEventListener('mousedown', function(e) {
        mouseStartX = e.clientX;
        mouseIsDragging = false;
    });
    
    galeriaContenedor.addEventListener('mousemove', function(e) {
        if (e.buttons === 1) { // Botón izquierdo presionado
            const deltaX = e.clientX - mouseStartX;
            if (Math.abs(deltaX) > 15) {
                mouseIsDragging = true;
            }
        }
    });
    
    galeriaContenedor.addEventListener('mouseup', function(e) {
        if (mouseIsDragging) {
            const deltaX = e.clientX - mouseStartX;
            
            if (deltaX > 50) {
                // Drag derecha - anterior
                cambiarGaleriaItem(-1);
            } else if (deltaX < -50) {
                // Drag izquierda - siguiente
                cambiarGaleriaItem(1);
            }
        }
        mouseIsDragging = false;
    });
    
    console.log('Gestos del modal configurados');
}

function paginaAnterior() {
    if (paginaActual > 0) {
        if (esMobile) {
            aplicarEfectoColocarHoja();
        }
        
        if (flipbook) {
            flipbook.flipPrev();
        } else {
            paginaActual--;
            actualizarCarrusel();
            actualizarNavegacion();
        }
    }
}

function paginaSiguiente() {
    if (paginaActual < totalPaginas - 1) {
        if (esMobile) {
            aplicarEfectoSacarHoja();
        }
        
        if (flipbook) {
            flipbook.flipNext();
        } else {
            paginaActual++;
            actualizarCarrusel();
            actualizarNavegacion();
        }
    }
}

function actualizarNavegacion() {
    paginaActualSpan.textContent = paginaActual + 1;
    
    btnAnterior.disabled = paginaActual === 0;
    btnSiguiente.disabled = paginaActual === totalPaginas - 1;
}

/* =====================================================
   EFECTOS DE HOJA MÓVIL
===================================================== */
function aplicarEfectosHojaMovil() {
    const hojas = document.querySelectorAll('.hoja-movil');
    hojas.forEach((hoja, index) => {
        // Remover clases anteriores
        hoja.classList.remove('sacando', 'colocando', 'entering');
        
        // Aplicar efecto según la posición
        if (index === paginaActual) {
            hoja.classList.add('entering');
        }
    });
}

function aplicarEfectoSacarHoja() {
    const hojas = document.querySelectorAll('.hoja-movil');
    const hojaActual = hojas[paginaActual];
    
    if (hojaActual) {
        hojaActual.classList.add('sacando');
        
        // Remover clase después de la animación
        setTimeout(() => {
            hojaActual.classList.remove('sacando');
        }, 1200);
    }
}

function aplicarEfectoColocarHoja() {
    const hojas = document.querySelectorAll('.hoja-movil');
    const hojaActual = hojas[paginaActual];
    
    if (hojaActual) {
        hojaActual.classList.add('colocando');
        
        // Remover clase después de la animación
        setTimeout(() => {
            hojaActual.classList.remove('colocando');
        }, 1200);
    }
}

/* =====================================================
   WHATSAPP DIRECTO PARA MÓVIL
===================================================== */
function abrirWhatsAppDirecto(productoId) {
    const producto = productos.find(p => p.id === productoId);
    
    if (!producto) {
        console.error('Producto no encontrado:', productoId);
        return;
    }
    
    console.log('Abriendo WhatsApp directo para:', producto.nombre);
    
    // Crear mensaje para WhatsApp
    const mensaje = `Hola! Me interesa el ${producto.nombre} - ${producto.precio}. ¿Podrían darme más información?`;
    const urlWhatsApp = `https://wa.me/51949823528?text=${encodeURIComponent(mensaje)}`;
    
    // Abrir WhatsApp directamente
    window.open(urlWhatsApp, '_blank');
}

/* =====================================================
   GALERÍA DEL MODAL
===================================================== */
let galeriaActual = 0;
let galeriaItems = [];

function configurarGaleriaModal(producto) {
    galeriaItems = [];
    
    // Agregar imagen
    galeriaItems.push({
        type: 'image',
        src: producto.img,
        alt: producto.nombre
    });
    
    // Agregar video si existe
    if (producto.videos) {
        galeriaItems.push({
            type: 'video',
            src: producto.videos,
            alt: `${producto.nombre} - Video`
        });
    }
    
    // Actualizar indicadores
    const indicadores = document.querySelector('.galeria-indicadores');
    indicadores.innerHTML = '';
    
    galeriaItems.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = `galeria-dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('data-index', index);
        dot.onclick = () => irAGaleriaItem(index);
        indicadores.appendChild(dot);
    });
    
    // Mostrar solo la imagen inicialmente
    mostrarGaleriaItem(0);
}

function mostrarGaleriaItem(index) {
    const items = document.querySelectorAll('.galeria-item');
    const dots = document.querySelectorAll('.galeria-dot');
    
    // Ocultar todos los items
    items.forEach(item => {
        item.style.display = 'none';
        item.classList.remove('active');
    });
    
    // Desactivar todos los dots
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (galeriaItems[index]) {
        const item = galeriaItems[index];
        const galeriaItem = document.querySelector(`[data-type="${item.type}"]`);
        
        if (galeriaItem) {
            galeriaItem.style.display = 'block';
            galeriaItem.classList.add('active');
            
            if (item.type === 'image') {
                const img = galeriaItem.querySelector('img');
                img.src = item.src;
                img.alt = item.alt;
            } else if (item.type === 'video') {
                const video = galeriaItem.querySelector('video');
                video.src = item.src;
                video.load();
            }
        }
        
        // Activar dot correspondiente
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }
    
    galeriaActual = index;
    actualizarBotonesGaleria();
}

function cambiarGaleriaItem(direction) {
    const nuevoIndex = galeriaActual + direction;
    
    if (nuevoIndex >= 0 && nuevoIndex < galeriaItems.length) {
        mostrarGaleriaItem(nuevoIndex);
    }
}

function irAGaleriaItem(index) {
    if (index >= 0 && index < galeriaItems.length) {
        mostrarGaleriaItem(index);
    }
}

function actualizarBotonesGaleria() {
    const btnPrev = document.querySelector('.galeria-prev');
    const btnNext = document.querySelector('.galeria-next');
    
    if (btnPrev) btnPrev.disabled = galeriaActual === 0;
    if (btnNext) btnNext.disabled = galeriaActual === galeriaItems.length - 1;
}

/* =====================================================
   GALERÍA DE HOJAS MÓVILES
===================================================== */
function cambiarHojaGaleria(element, index) {
    const hoja = element.closest('.hoja-movil');
    const items = hoja.querySelectorAll('.hoja-galeria-item');
    const dots = hoja.querySelectorAll('.hoja-galeria-dot');
    
    // Ocultar todos los items
    items.forEach(item => {
        item.style.display = 'none';
        item.classList.remove('active');
    });
    
    // Desactivar todos los dots
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Mostrar item seleccionado
    if (items[index]) {
        items[index].style.display = 'block';
        items[index].classList.add('active');
    }
    
    // Activar dot correspondiente
    if (dots[index]) {
        dots[index].classList.add('active');
    }
}

/* =====================================================
   GESTOS DE GALERÍA MÓVIL
===================================================== */
function configurarGestosGaleriaMovil() {
    console.log('Configurando gestos de galería móvil...');
    
    // Agregar gestos a todas las galerías móviles
    const galerias = document.querySelectorAll('.hoja-galeria');
    galerias.forEach((galeria, index) => {
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        let isHorizontalSwipe = false;
        
        galeria.addEventListener('touchstart', function(e) {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            isDragging = false;
            isHorizontalSwipe = false;
            
            // Prevenir propagación para evitar cambio de hoja
            e.stopPropagation();
        }, { passive: true });
        
        galeria.addEventListener('touchmove', function(e) {
            if (!isDragging) {
                const touch = e.touches[0];
                const deltaX = touch.clientX - startX;
                const deltaY = touch.clientY - startY;
                
                // Detectar si es un deslizamiento horizontal
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 15) {
                    isDragging = true;
                    isHorizontalSwipe = true;
                    console.log('Swipe horizontal en galería detectado');
                    
                    // Prevenir propagación para evitar cambio de hoja
                    e.stopPropagation();
                } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 15) {
                    isDragging = true;
                    isHorizontalSwipe = false;
                }
            }
        }, { passive: true });
        
        galeria.addEventListener('touchend', function(e) {
            if (isDragging && isHorizontalSwipe) {
                const touch = e.changedTouches[0];
                const deltaX = touch.clientX - startX;
                
                console.log('Swipe en galería - deltaX:', deltaX);
                
                // Prevenir propagación para evitar cambio de hoja
                e.stopPropagation();
                
                if (deltaX > 50) {
                    // Swipe derecha - anterior en galería
                    const dots = galeria.querySelectorAll('.hoja-galeria-dot');
                    const activeDot = galeria.querySelector('.hoja-galeria-dot.active');
                    if (activeDot) {
                        const currentIndex = parseInt(activeDot.getAttribute('data-index'));
                        if (currentIndex > 0) {
                            cambiarHojaGaleria(activeDot, currentIndex - 1);
                        }
                    }
                } else if (deltaX < -50) {
                    // Swipe izquierda - siguiente en galería
                    const dots = galeria.querySelectorAll('.hoja-galeria-dot');
                    const activeDot = galeria.querySelector('.hoja-galeria-dot.active');
                    if (activeDot) {
                        const currentIndex = parseInt(activeDot.getAttribute('data-index'));
                        if (currentIndex < dots.length - 1) {
                            cambiarHojaGaleria(activeDot, currentIndex + 1);
                        }
                    }
                }
            }
            
            isDragging = false;
            isHorizontalSwipe = false;
        }, { passive: true });
    });
    
    console.log(`Gestos configurados en ${galerias.length} galerías móviles`);
}

/* =====================================================
   MODAL DE PRODUCTO (SOLO DESKTOP)
===================================================== */
function abrirModalProducto(productoId) {
    // Solo abrir modal en desktop
    if (esMobile) {
        abrirWhatsAppDirecto(productoId);
        return;
    }
    
    const producto = productos.find(p => p.id === productoId);
    
    if (!producto) {
        console.error('Producto no encontrado:', productoId);
        return;
    }
    
    console.log('Abriendo modal para:', producto.nombre);
    
    // Configurar galería
    configurarGaleriaModal(producto);
    
    // Actualizar contenido del modal
    document.getElementById('modal-titulo').textContent = producto.nombre;
    document.getElementById('modal-incluye').textContent = `Incluye: ${producto.incluye}`;
    document.getElementById('modal-descripcion').textContent = producto.desc;
    document.getElementById('modal-precio-valor').textContent = producto.precio;
    
    // Configurar botón de WhatsApp
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const mensaje = `Hola! Me interesa el ${producto.nombre} - ${producto.precio}. ¿Podrían darme más información?`;
    whatsappBtn.href = `https://wa.me/51949823528?text=${encodeURIComponent(mensaje)}`;
    
    // Mostrar modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Configurar gestos para la galería del modal
    configurarGestosModal();
}

function cerrarModal() {
    console.log('Cerrando modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/* =====================================================
   REGENERACIÓN DEL CATÁLOGO
===================================================== */
function regenerarCatalogo() {
    console.log('Regenerando catálogo para nuevo dispositivo...');
    
    // Destruir flipbook actual si existe
    if (flipbook) {
        try {
            if (typeof flipbook.destroy === 'function') {
                flipbook.destroy();
                console.log('Flipbook destruido correctamente');
            }
        } catch (error) {
            console.log('Error al destruir flipbook:', error);
        }
        flipbook = null;
    }
    
    // Limpiar contenedor completamente
    if (flipbookContainer) {
        flipbookContainer.innerHTML = '';
    }
    
    // Resetear página actual
    paginaActual = 0;
    
    // Regenerar páginas
    generarPaginas();
    
    // Reinicializar flipbook solo si no es móvil
    if (!esMobile) {
    setTimeout(() => {
        inicializarFlipbook();
        actualizarNavegacion();
        }, 200);
    } else {
        // Para móvil, solo actualizar navegación
        actualizarNavegacion();
    }
}

/* =====================================================
   UTILIDADES
===================================================== */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Función de manejo de errores de imágenes
function manejarErrorImagen(img) {
    console.warn('Error cargando imagen:', img.src);
    img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f3f4f6"/><text x="150" y="100" font-family="Arial, sans-serif" font-size="14" fill="%23374151" text-anchor="middle" dy="0.3em">Imagen no disponible</text></svg>';
}

// Agregar manejo de errores a las imágenes
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('error', function(e) {
        if (e.target && e.target.tagName === 'IMG') {
            manejarErrorImagen(e.target);
        }
    }, true);
});

/* =====================================================
   INFORMACIÓN DE DEBUGGING
===================================================== */
console.log('Script del catálogo cargado');
console.log('Productos disponibles:', productos.length);
console.log('Versión del catálogo: 2025.2');
