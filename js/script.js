// Array de productos navideños
const productos = [
  {
    nombre: "Servilletero de Reno Juguetón",
    titulo: "Amigo del Bosque en tu Mesa",
    descripcion: "Dale un toque tierno y rústico a tu decoración con este adorable reno de fieltro. Su diseño amigable y su suave bufanda verde lo convierten en el detalle perfecto para una cena navideña acogedora y familiar.",
    imagen: "images/servilletero1.jpg",
    precio: "S/ 25.00"
  },
  {
    nombre: "Servilletero de Santa Claus",
    titulo: "La Magia de Santa",
    descripcion: "La alegría de la Navidad llega a tu mesa con este brillante servilletero de Santa Claus. Su acabado holográfico y su sonrisa amigable capturan la esencia mágica de la temporada, ideal para sorprender a grandes y pequeños.",
    imagen: "images/servilletero2.jpg",
    precio: "S/ 28.00"
  },
  {
    nombre: "Servilletero de Estrella y Bayas",
    titulo: "Estrella de Belén Rústica",
    descripcion: "Un diseño que combina la calidez de la madera con el toque festivo de las bayas rojas. Este servilletero con una estrella calada es perfecto para crear un ambiente natural y elegante, evocando una Navidad tradicional y campestre.",
    imagen: "images/servilletero3.jpg",
    precio: "S/ 24.00"
  },
  {
    nombre: "Servilletero de Árbol de Madera",
    titulo: "Bosque Navideño Iluminado",
    descripcion: "Este servilletero de madera con forma de pino y decorado con pequeños cristales rojos aporta un estilo sofisticado y natural. Es la pieza ideal para una mesa que busca combinar la simplicidad de la naturaleza con un sutil toque de brillo.",
    imagen: "images/servilletero4.jpg",
    precio: "S/ 27.00"
  },
  {
    nombre: "Servilletero de Casita de Jengibre",
    titulo: "Dulce Hogar Navideño",
    descripcion: "Endulza tu decoración con esta encantadora casita de jengibre cubierta de purpurina dorada. Es un detalle festivo y divertido que evoca los sabores y aromas de la Navidad, perfecto para una celebración llena de calidez.",
    imagen: "images/servilletero5.jpg",
    precio: "S/ 26.00"
  },
  {
    nombre: "Servilletero de Árbol de Navidad Clásico",
    titulo: "Espíritu Festivo en Miniatura",
    descripcion: "Este servilletero captura la esencia de un árbol de Navidad tradicional en un pequeño y brillante detalle. Decorado con guirnaldas y una estrella en la punta, es el complemento perfecto para una mesa alegre y colorida.",
    imagen: "images/servilletero6.jpg",
    precio: "S/ 25.00"
  },
  {
    nombre: "Servilletero de Flor Dorada",
    titulo: "Elegancia Floral Dorada",
    descripcion: "Aporta un toque de distinción y glamour a tu mesa con este servilletero en forma de flor dorada. Su diseño metálico y su centro rojo brillante lo hacen ideal para cenas de gala y celebraciones sofisticadas durante todo el año.",
    imagen: "images/servilletero7.jpg",
    precio: "S/ 30.00"
  },
  {
    nombre: "Servilletero de Lazo Escocés y Piñas",
    titulo: "Abrazo Invernal",
    descripcion: "Este servilletero evoca el encanto de una cabaña en invierno. La combinación del lazo de tartán, las piñas y las ramas de pino crea una atmósfera rústica y acogedora, perfecta para una cena navideña con un toque tradicional.",
    imagen: "images/servilletero8.jpg",
    precio: "S/ 27.00"
  }
];

// Variables globales
let flipbook;
let currentPage = 0;
let isMobile = window.innerWidth <= 768;

// Función para detectar si es móvil
function detectMobile() {
  isMobile = window.innerWidth <= 768;
}

// Función para crear la portada
function createCoverPage() {
  return `
    <div class="page cover-page">
      <h1 class="cover-title">Catálogo Navideño</h1>
      <p class="cover-subtitle">Colección Exclusiva de Servilleteros</p>
      <div class="cover-year">2025</div>
    </div>
  `;
}

// Función para crear una tarjeta de producto
function createProductCard(producto, index) {
  return `
    <div class="product-card" data-product-index="${index}">
      <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image" loading="lazy">
      <h3 class="product-name">${producto.nombre}</h3>
      <h4 class="product-title">${producto.titulo}</h4>
      <p class="product-description">${producto.descripcion}</p>
      <div class="product-price">${producto.precio}</div>
    </div>
  `;
}

// Función para crear páginas de productos
function createProductPages() {
  const pages = [];
  const productsPerPage = isMobile ? 1 : 2;
  
  for (let i = 0; i < productos.length; i += productsPerPage) {
    let pageContent = '<div class="page products-page">';
    
    for (let j = i; j < i + productsPerPage && j < productos.length; j++) {
      pageContent += createProductCard(productos[j], j);
    }
    
    pageContent += '</div>';
    pages.push(pageContent);
  }
  
  return pages;
}

// Función para generar todas las páginas
function generatePages() {
  const catalogoContainer = document.getElementById('catalogo');
  catalogoContainer.innerHTML = '';
  
  // Crear portada
  const coverPage = createCoverPage();
  catalogoContainer.innerHTML += coverPage;
  
  // Crear páginas de productos
  const productPages = createProductPages();
  productPages.forEach(page => {
    catalogoContainer.innerHTML += page;
  });
}

// Función para inicializar el flipbook
function initializeFlipbook() {
  const catalogoContainer = document.getElementById('catalogo');
  
  // Configuración responsive del flipbook
  const config = {
    width: isMobile ? 350 : 800,
    height: isMobile ? 500 : 600,
    size: 'stretch',
    maxShadowOpacity: 0.5,
    showCover: true,
    mobileScrollSupport: true,
    clickEventForward: true,
    usePortrait: isMobile,
    startPage: 0,
    drawShadow: true,
    flippingTime: 1000,
    useMouseEvents: true,
    swipeDistance: 30,
    showPageCorners: true,
    disableFlipByClick: false
  };
  
  // Crear nueva instancia del flipbook
  flipbook = new St.PageFlip(catalogoContainer, config);
  
  // Cargar las páginas
  const pages = catalogoContainer.querySelectorAll('.page');
  flipbook.loadFromHTML(pages);
  
  // Event listeners para el flipbook
  flipbook.on('flip', (e) => {
    currentPage = e.data;
    updateNavigationButtons();
  });
  
  flipbook.on('changeOrientation', (e) => {
    updateFlipbookSize();
  });
  
  // Actualizar botones de navegación
  updateNavigationButtons();
}

// Función para actualizar el tamaño del flipbook
function updateFlipbookSize() {
  if (flipbook) {
    const newWidth = isMobile ? 350 : 800;
    const newHeight = isMobile ? 500 : 600;
    flipbook.getSettings().width = newWidth;
    flipbook.getSettings().height = newHeight;
    flipbook.updateFromHtml();
  }
}

// Función para actualizar los botones de navegación
function updateNavigationButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (flipbook) {
    const totalPages = flipbook.getPageCount();
    
    prevBtn.disabled = currentPage <= 0;
    nextBtn.disabled = currentPage >= totalPages - 1;
  }
}

// Función para configurar la navegación
function setupNavigation() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  prevBtn.addEventListener('click', () => {
    if (flipbook && currentPage > 0) {
      flipbook.flipPrev();
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (flipbook) {
      flipbook.flipNext();
    }
  });
}

// Función para configurar el modal
function setupModal() {
  const modal = document.getElementById('productModal');
  const closeBtn = document.querySelector('.close');
  
  // Cerrar modal al hacer clic en la X
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
  
  // Cerrar modal al hacer clic fuera del contenido
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
  
  // Cerrar modal con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
}

// Función para abrir el modal con información del producto
function openProductModal(productIndex) {
  const producto = productos[productIndex];
  const modal = document.getElementById('productModal');
  
  // Actualizar contenido del modal
  document.getElementById('modalImage').src = producto.imagen;
  document.getElementById('modalImage').alt = producto.nombre;
  document.getElementById('modalTitle').textContent = producto.nombre;
  document.getElementById('modalSubtitle').textContent = producto.titulo;
  document.getElementById('modalDescription').textContent = producto.descripcion;
  document.getElementById('modalPrice').textContent = producto.precio;
  
  // Configurar enlace de WhatsApp
  const whatsappBtn = document.getElementById('whatsappBtn');
  const message = `Hola, quiero información sobre ${producto.nombre}`;
  whatsappBtn.href = `https://wa.me/51999999999?text=${encodeURIComponent(message)}`;
  
  // Mostrar modal
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Función para configurar los eventos de clic en productos
function setupProductEvents() {
  document.addEventListener('click', (e) => {
    const productCard = e.target.closest('.product-card');
    if (productCard) {
      const productIndex = parseInt(productCard.getAttribute('data-product-index'));
      openProductModal(productIndex);
    }
  });
}

// Función para manejar el redimensionamiento de la ventana
function handleResize() {
  const wasMobile = isMobile;
  detectMobile();
  
  if (wasMobile !== isMobile) {
    // Regenerar páginas si cambió el tipo de dispositivo
    generatePages();
    
    // Reinicializar flipbook
    if (flipbook) {
      flipbook.destroy();
    }
    initializeFlipbook();
  } else {
    // Solo actualizar tamaño
    updateFlipbookSize();
  }
}

// Función para precargar imágenes
function preloadImages() {
  productos.forEach(producto => {
    const img = new Image();
    img.src = producto.imagen;
  });
}

// Función de inicialización principal
function init() {
  // Detectar tipo de dispositivo
  detectMobile();
  
  // Precargar imágenes
  preloadImages();
  
  // Generar páginas
  generatePages();
  
  // Inicializar flipbook
  initializeFlipbook();
  
  // Configurar navegación
  setupNavigation();
  
  // Configurar modal
  setupModal();
  
  // Configurar eventos de productos
  setupProductEvents();
  
  // Configurar redimensionamiento
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 250);
  });
  
  // Animación de entrada
  setTimeout(() => {
    document.querySelectorAll('.page').forEach((page, index) => {
      setTimeout(() => {
        page.classList.add('page-enter');
      }, index * 100);
    });
  }, 500);
}

// Función para manejar errores de carga de imágenes
function handleImageError() {
  document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
      e.target.alt = 'Imagen no disponible';
    }
  }, true);
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    init();
    handleImageError();
  });
} else {
  init();
  handleImageError();
}