/* =====================================================
   CATÁLOGO NAVIDAD EN TU MESA - SCRIPT PRINCIPAL
   Versión optimizada 2025.2
   - Soporte completo para modo "una sola página" en móvil
   - Comportamiento tipo libro físico
   - Mismo diseño responsive y compatibilidad total
===================================================== */

// Datos de productos del catálogo
const productos = [
    {
        id: "conjunto1",
        nombre: "Conjunto 'Árbol Navideño'",
        desc: "Elegante conjunto de servilleta con diseño de árbol navideño tradicional en tonos verde y dorado, acompañado de aro servilletero metálico con acabado dorado. Perfecto para cenas navideñas familiares.",
        precio: "S/ 28.00",
        img: "images/servilleta_arbol.jpg",
        codigo: "NAV-001",
        incluye: "1 Servilleta + 1 Aro Servilletero"
    },
    {
        id: "conjunto2",
        nombre: "Conjunto 'Estrella Brillante'",
        desc: "Servilleta con estampado de estrella navideña en colores plateado y azul, complementada con aro servilletero con detalles estrellados. Ideal para una mesa navideña moderna y sofisticada.",
        precio: "S/ 32.00",
        img: "images/servilleta_estrella.jpg",
        codigo: "NAV-002",
        incluye: "1 Servilleta + 1 Aro Servilletero"
    },
    {
        id: "conjunto3",
        nombre: "Conjunto 'Reno Mágico'",
        desc: "Conjunto con diseño tierno de reno navideño sobre fondo crema, acompañado de aro servilletero con motivos de cuernos de reno. Perfecto para crear un ambiente cálido y acogedor.",
        precio: "S/ 30.00",
        img: "images/servilleta_reno.jpg",
        codigo: "NAV-003",
        incluye: "1 Servilleta + 1 Aro Servilletero"
    },
    {
        id: "conjunto4",
        nombre: "Conjunto 'Casa Navideña'",
        desc: "Servilleta con ilustración de casa navideña con nieve y luces, complementada con aro servilletero en forma de casita. Evoca la magia de la navidad en el hogar.",
        precio: "S/ 35.00",
        img: "images/servilleta_casa.jpg",
        codigo: "NAV-004",
        incluye: "1 Servilleta + 1 Aro Servilletero"
    },
    {
        id: "conjunto5",
        nombre: "Conjunto 'Campana Dorada'",
        desc: "Elegante servilleta con diseño de campanas navideñas en tonos dorados, acompañada de aro servilletero con forma de campana. Simboliza la alegría y celebración navideña.",
        precio: "S/ 29.00",
        img: "images/servilleta_campana.jpg",
        codigo: "NAV-005",
        incluye: "1 Servilleta + 1 Aro Servilletero"
    },
    {
        id: "conjunto6",
        nombre: "Conjunto 'Flor de Nochebuena'",
        desc: "Servilleta con estampado de flores de nochebuena en rojo intenso, complementada con aro servilletero floral. Representa la tradición y belleza navideña mexicana.",
        precio: "S/ 33.00",
        img: "images/servilleta_flor.jpg",
        codigo: "NAV-006",
        incluye: "1 Servilleta + 1 Aro Servilletero"
    },
    {
        id: "conjunto7",
        nombre: "Conjunto 'Santa Claus'",
        desc: "Servilleta con diseño divertido de Santa Claus, acompañada de aro servilletero con motivos navideños. Ideal para cenas familiares con niños y crear un ambiente festivo.",
        precio: "S/ 31.00",
        img: "images/servilleta_santa.jpg",
        codigo: "NAV-007",
        incluye: "1 Servilleta + 1 Aro Servilletero"
    },
    {
        id: "conjunto8",
        nombre: "Conjunto 'Árbol Premium'",
        desc: "Versión premium del conjunto de árbol navideño con acabados especiales y materiales de alta calidad. Servilleta con bordados dorados y aro servilletero de acero inoxidable.",
        precio: "S/ 42.00",
        img: "images/servilleta_arbol2.jpg",
        codigo: "NAV-008",
        incluye: "1 Servilleta + 1 Aro Servilletero"
    }
];

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
   INICIALIZACIÓN
===================================================== */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando Catálogo Navidad en tu Mesa...');
    
    detectarDispositivo();
    generarPaginas();
    
    if (!esMobile) {
        // Solo inicializar flipbook para desktop
        setTimeout(() => {
            inicializarFlipbook();
        }, 100);
    }
    
    configurarEventos();
    
    console.log('Catálogo inicializado correctamente');
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
    console.log('Generando 10 hojas individuales para móvil...');
    
    // Hoja 1: Portada
    generarHojaPortada(container);
    
    // Hojas 2-9: Productos individuales
    for (let i = 0; i < productos.length; i++) {
        generarHojaProducto(productos[i], i + 2, container);
    }
    
    // Hoja 10: Contraportada
    generarHojaContraportada(container);
    
    // Verificar que se generaron las hojas
    const hojasGeneradas = container.querySelectorAll('.hoja-movil');
    console.log(`Hojas generadas: ${hojasGeneradas.length} de 10 esperadas`);
    
    if (hojasGeneradas.length === 0) {
        console.error('No se generaron hojas móviles');
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
                <div class="hoja-codigo">${producto.codigo}</div>
            </div>
            
            <div class="hoja-imagen">
                <img src="${producto.img}" alt="${producto.nombre}" loading="lazy" onerror="manejarErrorImagen(this)">
                <div class="hoja-overlay"></div>
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
                <button class="hoja-btn-whatsapp" onclick="abrirModalProducto('${producto.id}')">
                    <span class="whatsapp-icon">📱</span>
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
                            <span class="contacto-icon">📱</span>
                            <span>WhatsApp: +51 949 823 528</span>
                        </div>
                        <div class="contacto-item">
                            <span class="contacto-icon">📧</span>
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
                    <span class="producto-codigo">${producto.codigo}</span>
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
            swipeDistance: 50,
            clickEventForward: true,
            usePortrait: esMobile,                 // 👉 En móvil: modo retrato
            display: esMobile ? "single" : "double", // 👉 1 página en móvil, 2 en desktop
            startPage: 0,
            drawShadow: true,
            flippingTime: esMobile ? 1000 : 800,  // 👉 Animación más lenta en móvil para efecto hoja
            useMouseEvents: true,
            showPageCorners: esMobile ? false : true, // 👉 Sin esquinas en móvil para efecto hoja limpia
            disableFlipByClick: false,
            autoSize: true,
            maxShadowOpacity: esMobile ? 0.3 : 0.5, // 👉 Sombra más sutil en móvil
            shadowSides: esMobile ? 0.8 : 1.0,       // 👉 Sombra más pronunciada en móvil
            shadowFlip: esMobile ? 0.6 : 0.4         // 👉 Sombra durante el flip más visible
        });
        
        // Cargar páginas desde HTML generado
        if (esMobile) {
            flipbook.loadFromHTML(document.querySelectorAll('.hoja-movil'));
        } else {
            flipbook.loadFromHTML(document.querySelectorAll('.pagina'));
        }
        
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
    const totalHojasMovil = 10;
    
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
    
    // Configurar gestos táctiles para móvil
    configurarGestosMovil();
    
    console.log('Navegación móvil configurada');
}

function configurarGestosMovil() {
    const mobileContainer = document.getElementById('mobile-catalog-container');
    let startX = 0;
    let isDragging = false;
    
    mobileContainer.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isDragging = false;
    }, { passive: true });
    
    mobileContainer.addEventListener('touchmove', function(e) {
        if (!isDragging) {
            const deltaX = e.touches[0].clientX - startX;
            if (Math.abs(deltaX) > 10) {
                isDragging = true;
            }
        }
    }, { passive: true });
    
    mobileContainer.addEventListener('touchend', function(e) {
        if (isDragging) {
            const deltaX = e.changedTouches[0].clientX - startX;
            
            if (deltaX > 50) {
                // Deslizar derecha - anterior
                document.getElementById('btn-anterior').click();
            } else if (deltaX < -50) {
                // Deslizar izquierda - siguiente
                document.getElementById('btn-siguiente').click();
            }
        }
        isDragging = false;
    }, { passive: true });
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
   MODAL DE PRODUCTO
===================================================== */
function abrirModalProducto(productoId) {
    const producto = productos.find(p => p.id === productoId);
    
    if (!producto) {
        console.error('Producto no encontrado:', productoId);
        return;
    }
    
    console.log('Abriendo modal para:', producto.nombre);
    
    // Actualizar contenido del modal
    document.getElementById('modal-img').src = producto.img;
    document.getElementById('modal-img').alt = producto.nombre;
    document.getElementById('modal-titulo').textContent = producto.nombre;
    document.getElementById('modal-codigo').textContent = `Código: ${producto.codigo}`;
    // CORRECCIÓN: quitar '<' que estaba por error
    document.getElementById('modal-incluye').textContent = `Incluye: ${producto.incluye}`;
    document.getElementById('modal-descripcion').textContent = producto.desc;
    document.getElementById('modal-precio-valor').textContent = producto.precio;
    
    // Configurar botón de WhatsApp
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const mensaje = `Hola! Me interesa el ${producto.nombre} (${producto.codigo}) - ${producto.precio}. ¿Podrían darme más información?`;
    whatsappBtn.href = `https://wa.me/51949823528?text=${encodeURIComponent(mensaje)}`;
    
    // Mostrar modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
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
            if (typeof flipbook.destroy === 'function') flipbook.destroy();
        } catch (error) {
            console.log('Error al destruir flipbook:', error);
        }
        flipbook = null;
    }
    
    // Resetear página actual
    paginaActual = 0;
    
    // Regenerar páginas
    generarPaginas();
    
    // Reinicializar flipbook
    setTimeout(() => {
        inicializarFlipbook();
        actualizarNavegacion();
    }, 150);
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
