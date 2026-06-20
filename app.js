/* =====================================================================
   CATÁLOGO DE PRODUCTOS
   =====================================================================
   Para agregar, editar o sacar productos, modificá este array.
   Cada producto necesita:
     - id: identificador único (no repetir)
     - nombre: nombre del producto
     - categoria: "anillos" | "collares" | "aros" | "pulseras"
     - precio: número, sin puntos ni comas (ej: 18500)
     - desc: descripción corta
     - img: link de la foto del producto
     - tipo: "compra" (hay stock, se puede comprar directo) o
             "consulta" (se consulta disponibilidad antes)
     - destacado: true / false → si es true, aparece en "Piezas exclusivas"
     - badge: opcional, texto corto tipo "Stock" o "Nuevo" (dejar "" si no querés ninguno)
===================================================================== */
const CATALOGO = [
  {
    id: "anillo-rio",
    nombre: "Anillo Río",
    categoria: "anillos",
    precio: 18500,
    desc: "Plata 925 con textura orgánica. Inspirado en la forma del agua en movimiento.",
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
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
    tipo: "compra",
    destacado: false,
    badge: "Stock"
  },
  {
    id: "anillo-luna",
    nombre: "Anillo Luna Nueva",
    categoria: "anillos",
    precio: 19800,
    desc: "Diseño minimalista con piedra de luna natural engastada a mano.",
    img: "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=600&auto=format&fit=crop&q=80",
    tipo: "consulta",
    destacado: false,
    badge: ""
  },
  {
    id: "collar-raiz",
    nombre: "Collar Raíz",
    categoria: "collares",
    precio: 26000,
    desc: "Pieza de autor con colgante en plata y piedra turquesa natural. Edición limitada.",
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    tipo: "consulta",
    destacado: true,
    badge: ""
  },
  {
    id: "collar-viento",
    nombre: "Collar Viento",
    categoria: "collares",
    precio: 19500,
    desc: "Cadena fina con colgante en plata calada. Minimalista y elegante para cualquier ocasión.",
    img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&auto=format&fit=crop&q=80",
    tipo: "consulta",
    destacado: false,
    badge: ""
  },
  {
    id: "aros-luna",
    nombre: "Aros Luna",
    categoria: "aros",
    precio: 14200,
    desc: "Aros colgantes en forma de media luna. Livianos, modernos y llenos de personalidad.",
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
    tipo: "compra",
    destacado: true,
    badge: "Stock"
  },
];

const NOMBRES_CATEGORIA = {
  anillos: "Anillos",
  collares: "Collares",
  aros: "Aros",
  pulseras: "Pulseras"
};

document.addEventListener("DOMContentLoaded", () => {

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        const collapseEl = document.getElementById('menuMobile');
        if (collapseEl && collapseEl.classList.contains('show')) {
          bootstrap.Collapse.getInstance(collapseEl)?.hide();
        }
      }
    });
  });

  // Reveal on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });

  function inicializarObserver() {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  function formatearPrecio(num) {
    return `$${parseInt(num).toLocaleString('es-AR')}`;
  }

  function crearCardProducto(p) {
    const badgeHTML = p.badge ? `<span class="producto-badge">${p.badge}</span>` : '';
    return `
      <div class="producto-card">
        <div class="producto-card-img">
          <img src="${p.img}" alt="${p.nombre}"/>
          ${badgeHTML}
        </div>
        <div class="producto-card-body">
          <p class="producto-categoria">${NOMBRES_CATEGORIA[p.categoria]}</p>
          <h3 class="producto-nombre">${p.nombre}</h3>
          <p class="producto-desc">${p.desc}</p>
          <div class="producto-footer">
            <span class="producto-precio">${formatearPrecio(p.precio)}</span>
            <button class="btn-consultar btn-reservar"
              data-nombre="${p.nombre}"
              data-precio="${p.precio}"
              data-tipo="${p.tipo}">
              ${p.tipo === 'compra' ? 'Comprar' : 'Consultar'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // 1. Pintar DESTACADOS (Fijo arriba)
  const contenedorDestacados = document.getElementById('contenedorDestacados');
  if (contenedorDestacados) {
    const destacados = CATALOGO.filter(p => p.destacado);
    contenedorDestacados.innerHTML = destacados.map((p, i) => `
      <div class="col-sm-6 col-lg-4 reveal reveal-delay-${(i % 3) + 1}">
        ${crearCardProducto(p)}
      </div>
    `).join('');
  }

  // 2. Pintar e Interceptar CATÁLOGO DINÁMICO (Abajo de la botonera)
  const contenedorCatalogo = document.getElementById('contenedorCatalogoFiltrado');
  const botonesFiltro = document.querySelectorAll('.filtro-btn');

  function renderizarCatalogoFiltrado(categoria) {
    if (!contenedorCatalogo) return;

    const productosFiltrados = categoria === 'todos' 
      ? CATALOGO 
      : CATALOGO.filter(p => p.categoria === categoria);

    if (productosFiltrados.length === 0) {
      contenedorCatalogo.innerHTML = `<p class="text-center text-muted my-5">No hay productos en esta categoría por el momento.</p>`;
      return;
    }

    contenedorCatalogo.innerHTML = productosFiltrados.map((p, i) => `
      <div class="col-sm-6 col-lg-4 reveal">
        ${crearCardProducto(p)}
      </div>
    `).join('');

    // Re-ejecutar observer para que las nuevas cartas tengan animación al aparecer
    setTimeout(() => {
      document.querySelectorAll('#contenedorCatalogoFiltrado .reveal').forEach(el => el.classList.add('visible'));
    }, 50);
  }

  // Render inicial del catálogo (muestra todos al cargar)
  renderizarCatalogoFiltrado('todos');

  // Lógica de clics en la botonera
  botonesFiltro.forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelector('.filtro-btn.active')?.classList.remove('active');
      this.classList.add('active');
      const filtroSeleccionado = this.dataset.filter;
      renderizarCatalogoFiltrado(filtroSeleccionado);
    });
  });

  // Inicializar animaciones base
  inicializarObserver();

  // Modal WhatsApp Lógica Global
  const modalEl = document.getElementById('modalReserva');
  const modal = new bootstrap.Modal(modalEl);
  const form = document.getElementById('formReserva');
  const modalTitulo = document.getElementById('modalTituloTexto');
  const btnSubmit = document.getElementById('btnSubmitModal');
  const contenedorTalle = document.getElementById('contenedorTalle');
  const inputTalle = document.getElementById('clienteTalle');
  let productoSel = '', precioSel = '', tipoAccion = 'consulta';

  const nombreGuardado = localStorage.getItem('joyeria_cliente_nombre');
  const telGuardado = localStorage.getItem('joyeria_cliente_telefono');
  if (nombreGuardado) document.getElementById('clienteNombre').value = nombreGuardado;
  if (telGuardado) document.getElementById('clienteTelefono').value = telGuardado;

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-reservar');
    if (!btn) return;

    productoSel = btn.dataset.nombre;
    precioSel = btn.dataset.precio;
    tipoAccion = btn.dataset.tipo || 'consulta';

    document.getElementById('itemReservaNombre').textContent = productoSel;
    document.getElementById('itemReservaPrecio').textContent = formatearPrecio(precioSel);

    if (tipoAccion === 'compra') {
      modalTitulo.textContent = 'Confirmar compra';
      btnSubmit.textContent = 'Confirmar compra por WhatsApp';
      contenedorTalle.classList.remove('d-none');
      inputTalle.setAttribute('required', 'true');
    } else {
      modalTitulo.textContent = 'Consultar por WhatsApp';
      btnSubmit.textContent = 'Enviar consulta por WhatsApp';
      contenedorTalle.classList.add('d-none');
      inputTalle.removeAttribute('required');
    }

    modal.show();
  });

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const nombre = document.getElementById('clienteNombre').value;
      const tel = document.getElementById('clienteTelefono').value;
      const talle = inputTalle.value;

      localStorage.setItem('joyeria_cliente_nombre', nombre);
      localStorage.setItem('joyeria_cliente_telefono', tel);

      const telefono = '5493436958831';
      let mensaje = tipoAccion === 'compra'
        ? `¡Hola Paula! Soy *${nombre}* (${tel}).\n\nQuiero *comprar*:\n- *${productoSel}*\n- Medida: *${talle}*\n- Precio: ${formatearPrecio(precioSel)}\n\n¿Cómo coordinamos el pago y el envío?`
        : `Hola Paula, soy *${nombre}* (${tel}).\n\nTe escribo desde la web, me interesa saber más sobre: *${productoSel}*. ¿Tenés disponibilidad? ¡Gracias!`;

      modal.hide();
      form.reset();
      document.getElementById('clienteNombre').value = nombre;
      document.getElementById('clienteTelefono').value = tel;

      window.open(`https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`, '_blank');
    });
  }
});