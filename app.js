const CATALOGO = [
  {
    id: "anillo-rio",
    nombre: "Anillo Río",
    categoria: "anillos",
    precio: 18500,
    desc: "Plata 925 con textura orgánica. Inspirado en la forma del agua en movimiento.",
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
    imgHover: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80", 
    tipo: "compra",
    destacado: true,
    badge: "Stock"
  },
  {
    id: "anillo-bosque",
    nombre: "Anillo Bosque",
    categoria: "anillos",
    precio: 21000,
    desc: "Textura de corteza en plata maciza. Robusto y delicado al mismo tiempo.",
    img: "https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=600&auto=format&fit=crop&q=80",
    imgHover: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&auto=format&fit=crop&q=80",
    tipo: "compra",
    destacado: true,
    badge: "Único"
  },
  {
    id: "aros-luna",
    nombre: "Aros Luna Nueva",
    categoria: "aros",
    precio: 16200,
    desc: "Discos martillados a mano reflectantes. Capturan la luz con cada movimiento.",
    img: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&auto=format&fit=crop&q=80",
    imgHover: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
    tipo: "compra",
    destacado: false,
    badge: "Stock"
  },
  {
    id: "collar-duna",
    nombre: "Collar Duna",
    categoria: "collares",
    precio: 29000,
    desc: "Colgante escultórico con relieve satinado sobre cadena de eslabones sutiles.",
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    imgHover: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&auto=format&fit=crop&q=80",
    tipo: "consulta",
    destacado: true,
    badge: "Encargo"
  },
  {
    id: "pulsera-viento",
    nombre: "Pulsera Viento",
    categoria: "pulseras",
    precio: 34000,
    desc: "Brazalete rígido regulable hecho de hilo de plata trenzado artesanalmente.",
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop&q=80",
    imgHover: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&auto=format&fit=crop&q=80",
    tipo: "compra",
    destacado: false,
    badge: "Stock"
  },
  {
    id: "anillo-origen",
    nombre: "Anillo Origen",
    categoria: "anillos",
    precio: 0,
    desc: "Pieza exclusiva con gema bruta a elección. Creamos tu diseño personalizado.",
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
    imgHover: "https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=600&auto=format&fit=crop&q=80",
    tipo: "consulta",
    destacado: false,
    badge: "Diseño"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  
  // =============================================
  // 0. LÓGICA DE CAMBIO DE TEMA (LIGHT / DARK)
  // =============================================
  const btnPC = document.getElementById('themeToggle');
  const btnMobile = document.getElementById('themeToggleMobile');
  
  const temaGuardado = localStorage.getItem('joyeria_theme') || 'dark';
  
  function actualizarIconosYClase(esClaro) {
    if (esClaro) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    
    [btnPC, btnMobile].forEach(btn => {
      if (!btn) return;
      const icono = btn.querySelector('i');
      if (icono) {
        icono.className = esClaro ? 'bi bi-moon-stars' : 'bi bi-sun';
      }
    });

    // Swap hero background image según el tema
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
      heroVideo.poster = esClaro
        ? 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&auto=format&fit=crop&q=80'
        : 'img/anillos.png';
    }
  }
  
  if (temaGuardado === 'light') {
    actualizarIconosYClase(true);
  } else {
    actualizarIconosYClase(false);
  }
  
  [btnPC, btnMobile].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const seActivoClaro = document.body.classList.toggle('light-mode');
      localStorage.setItem('joyeria_theme', seActivoClaro ? 'light' : 'dark');
      actualizarIconosYClase(seActivoClaro);
    });
  });

  // =============================================
  // 1. COMPORTAMIENTO NAVBAR ON SCROLL
  // =============================================
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('navbar-scrolled');
    } else {
      navbar?.classList.remove('navbar-scrolled');
    }
  });

  // =============================================
  // 2. RENDERIZAR CATÁLOGO CON FILTROS
  // =============================================
  const contenedorGrid = document.getElementById('contenedorCatalogoFiltrado');
  const botonesFiltro = document.querySelectorAll('.filtro-btn');

  function formatearPrecio(valor) {
    if (valor === 0) return 'Consultar precio';
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(valor);
  }

  function crearCardProducto(p) {
    const textoBoton = p.tipo === 'compra' ? 'Comprar por WhatsApp' : 'Consultar diseño';
    const precioTexto = p.precio === 0 ? 'Diseño a Pedido' : formatearPrecio(p.precio);
    return `
      <div class="producto-card" data-id="${p.id}">
        <div class="producto-card-img">
          ${p.badge ? `<span class="producto-badge">${p.badge}</span>` : ''}
          <img src="${p.img}" alt="${p.nombre}" class="img-principal" loading="lazy">
          ${p.imgHover ? `<img src="${p.imgHover}" alt="${p.nombre} detalle" class="img-secundaria" loading="lazy">` : ''}
        </div>
        <div class="producto-card-body">
          <h4 class="producto-nombre">${p.nombre}</h4>
          <span class="producto-precio">${precioTexto}</span>
          <p class="producto-desc">${p.desc}</p>
          <button class="btn-consultar" data-id="${p.id}">${textoBoton}</button>
        </div>
      </div>
    `;
  }

  // Renderizar DESTACADOS
  const contenedorDestacados = document.getElementById('contenedorDestacados');
  if (contenedorDestacados) {
    const destacados = CATALOGO.filter(p => p.destacado);
    contenedorDestacados.innerHTML = destacados.map((p, i) => `
      <div class="col-12 col-md-6 col-lg-4 reveal reveal-delay-${(i % 3) + 1}">
        ${crearCardProducto(p)}
      </div>
    `).join('');
  }

  function inyectarProductos(categoriaFiltrada = 'todos') {
    if (!contenedorGrid) return;
    contenedorGrid.innerHTML = '';

    const productosAMostrar = categoriaFiltrada === 'todos'
      ? CATALOGO
      : CATALOGO.filter(p => p.categoria === categoriaFiltrada);

    if (productosAMostrar.length === 0) {
      contenedorGrid.innerHTML = `<div class="col-12 text-center py-5"><p>No se encontraron piezas en esta categoría por el momento.</p></div>`;
      return;
    }

    contenedorGrid.innerHTML = productosAMostrar.map((p, i) => `
      <div class="col-12 col-md-6 col-lg-4 reveal">
        ${crearCardProducto(p)}
      </div>
    `).join('');

    vincularEventosDetalle();
    setTimeout(() => {
      document.querySelectorAll('#contenedorCatalogoFiltrado .reveal').forEach(el => el.classList.add('visible'));
    }, 50);
  }

  if (botonesFiltro) {
    botonesFiltro.forEach(btn => {
      btn.addEventListener('click', (e) => {
        botonesFiltro.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const cat = e.currentTarget.getAttribute('data-filter');
        inyectarProductos(cat);
      });
    });
  }

  inyectarProductos('todos');

  // =============================================
  // 3. SISTEMA DE GESTIÓN DEL MODAL & SINK WHATSAPP
  // =============================================
  let productoSel = '';
  let precioSel = 0;
  let tipoAccion = 'compra';

  const modalElement = document.getElementById('modalReserva');
  const modal = modalElement ? new bootstrap.Modal(modalElement) : null;
  const form = document.getElementById('formReserva');

  const modalTitulo = document.getElementById('modalTituloTexto');
  const itemNombre = document.getElementById('itemReservaNombre');
  const itemPrecio = document.getElementById('itemReservaPrecio');
  const contenedorTalle = document.getElementById('contenedorTalle');
  const inputTalle = document.getElementById('clienteTalle');
  const btnSubmit = document.getElementById('btnSubmitModal');

  if(document.getElementById('clienteNombre')) {
    document.getElementById('clienteNombre').value = localStorage.getItem('joyeria_cliente_nombre') || '';
  }
  if(document.getElementById('clienteTelefono')) {
    document.getElementById('clienteTelefono').value = localStorage.getItem('joyeria_cliente_telefono') || '';
  }

  function vincularEventosDetalle() {
    const btns = document.querySelectorAll('.btn-consultar');
    btns.forEach(b => {
      b.addEventListener('click', (e) => {
        const idProd = e.currentTarget.getAttribute('data-id');
        const item = CATALOGO.find(p => p.id === idProd);
        if (!item || !modal) return;

        productoSel = item.nombre;
        precioSel = item.precio;
        tipoAccion = item.tipo;

        if(itemNombre) itemNombre.textContent = item.nombre;
        if(itemPrecio) itemPrecio.textContent = item.precio === 0 ? 'A coordinar' : formatearPrecio(item.precio);

        if (tipoAccion === 'compra') {
          if(modalTitulo) modalTitulo.textContent = 'Coordinar Compra';
          if(btnSubmit) btnSubmit.textContent = 'Confirmar pedido por WhatsApp';
          contenedorTalle?.classList.remove('d-none');
          inputTalle?.setAttribute('required', 'true');
        } else {
          if(modalTitulo) modalTitulo.textContent = 'Consultar por WhatsApp';
          if(btnSubmit) btnSubmit.textContent = 'Enviar consulta por WhatsApp';
          contenedorTalle?.classList.add('d-none');
          inputTalle?.removeAttribute('required');
        }

        modal.show();
      });
    });
  }

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      
      const nombre = document.getElementById('clienteNombre').value;
      const tel = document.getElementById('clienteTelefono').value;
      const talle = inputTalle ? inputTalle.value : '';

      localStorage.setItem('joyeria_cliente_nombre', nombre);
      localStorage.setItem('joyeria_cliente_telefono', tel);

      const telefono = '5493436958831'; 
      let mensaje = tipoAccion === 'compra'
        ? `¡Hola Paula! Soy *${nombre}* (${tel}).\n\nQuiero *comprar*:\n- *${productoSel}*\n- Medida: *${talle}*\n- Precio: ${formatearPrecio(precioSel)}\n\n¿Cómo coordinamos el pago y el envío?`
        : `Hola Paula, soy *${nombre}* (${tel}).\n\nTe escribo desde la web, me interesa saber más sobre: *${productoSel}*. ¿Tenés disponibilidad? ¡Gracias!`;

      modal?.hide();
      form.reset();

      const url = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank');
    });
  }

  // =============================================
  // 4. ANIMACIONES SUTILES AL HACER SCROLL
  // =============================================
  function inicializarScrollReveal() {
    const elementosReveal = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); 
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elementosReveal.forEach(el => observer.observe(el));
  }

  inicializarScrollReveal();
});