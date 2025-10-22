/* =====================================================
   CATÁLOGO NAVIDAD EN TU MESA - SCRIPT PRINCIPAL
   Funcionalidad completa del flipbook con productos navideños
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

// Variables globales
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
    
    // Detectar dispositivo
    detectarDispositivo();
    
    // Generar páginas
    generarPaginas();
    
    // Inicializar flipbook
    setTimeout(() => {
        inicializarFlipbook();
    }, 100);
    
    // Configurar eventos
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
    
    // Actualizar layout según dispositivo
    actualizarLayoutResponsivo();
}

function actualizarLayoutResponsivo() {
    // Layout ahora se maneja completamente por CSS con clases específicas
    console.log(`Layout actualizado para: ${esMobile ? 'Catálogo Móvil' : 'Catálogo Desktop'}`);
}

/* =====================================================
   GENERACIÓN DE PÁGINAS
===================================================== */
function generarPaginas() {
    console.log('Generando páginas del catálogo...');
    console.log('Dispositivo móvil detectado:', esMobile);
    
    // Dos catálogos diferentes pero con mismo efecto
    const productosPorPagina = esMobile ? 1 : 2;
    const paginasProductos = Math.ceil(productos.length / productosPorPagina);
    totalPaginas = paginasProductos + 1; // +1 por la portada
    
    console.log(`Catálogo ${esMobile ? 'MÓVIL' : 'DESKTOP'}: ${productosPorPagina} productos por página`);
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
    
    // Títulos temáticos para las páginas
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
                <img src="${producto.img}" alt="${producto.nombre}" loading="lazy">
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
        
        // Configuración original que funcionaba bien
        flipbook = new St.PageFlip(flipbookContainer, {
            width: esMobile ? 350 : 600,
            height: esMobile ? 500 : 700,
            size: 'stretch',
            minWidth: 300,
            maxWidth: 800,
            minHeight: 400,
            maxHeight: 800,
            showCover: true,
            mobileScrollSupport: false,
            swipeDistance: 50,
            clickEventForward: true,
            usePortrait: false,
            startPage: 0,
            drawShadow: true,
            flippingTime: 800,
            useMouseEvents: true,
            showPageCorners: true,
            disableFlipByClick: false,
            autoSize: false,
            maxShadowOpacity: 0.5
        });
        
        // Eventos del flipbook
        flipbook.on('flip', function(e) {
            console.log('Página cambiada:', e.data);
            paginaActual = e.data;
            actualizarNavegacion();
        });
        
        // Solo eventos esenciales para todos los dispositivos
        flipbook.on('start', function(e) {
            console.log('Flipbook iniciado correctamente');
        });
        
        flipbook.on('changeOrientation', function(e) {
            console.log('Orientación cambiada:', e.data);
            setTimeout(() => {
                flipbook.updateState();
            }, 100);
        });
        
        flipbook.on('changeState', function(e) {
            console.log('Estado cambiado:', e.data);
        });
        
        // Cargar páginas
        flipbook.loadFromHTML(document.querySelectorAll('.pagina'));
        
        // Verificación simple post-inicialización
        setTimeout(() => {
            flipbook.updateState();
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
    
    const paginas = flipbookContainer.querySelectorAll('.pagina');
    paginas.forEach((pagina, index) => {
        pagina.style.position = 'absolute';
        pagina.style.top = '0';
        pagina.style.left = `${index * 100}%`;
        pagina.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        pagina.style.transform = 'translateX(0)';
    });
    
    actualizarCarrusel();
}

function actualizarCarrusel() {
    const paginas = flipbookContainer.querySelectorAll('.pagina');
    paginas.forEach((pagina, index) => {
        pagina.style.transform = `translateX(-${paginaActual * 100}%)`;
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
        }
    }, 300));
    
    // Dejar que StPageFlip maneje todos los eventos nativamente
    // Sin interferencia de eventos personalizados
}





// Mantener la función original por compatibilidad
function configurarEventosTactiles() {
    // Esta función ahora está deprecada en favor de configurarEventosHibridos
    console.log('Usando eventos híbridos para mejor compatibilidad móvil');
}

function paginaAnterior() {
    if (paginaActual > 0) {
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
            flipbook.destroy();
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
    }, 100);
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
        if (e.target.tagName === 'IMG') {
            manejarErrorImagen(e.target);
        }
    }, true);
});

/* =====================================================
   INFORMACIÓN DE DEBUGGING
===================================================== */
console.log('Script del catálogo cargado');
console.log('Productos disponibles:', productos.length);
console.log('Versión del catálogo: 2025.1.0');