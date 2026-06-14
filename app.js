document.addEventListener("DOMContentLoaded", () => {

  // ── Smooth scroll ──────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        // Cerrar menú mobile si está abierto
        const collapseEl = document.getElementById('menuMobile');
        if (collapseEl && collapseEl.classList.contains('show')) {
          bootstrap.Collapse.getInstance(collapseEl)?.hide();
        }
      }
    });
  });

  // ── Reveal on scroll ───────────────────────────────────
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── Filtro de productos ────────────────────────────────
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelector('.filter-btn.active')?.classList.remove('active');
      this.classList.add('active');
      const cat = this.dataset.filter;
      document.querySelectorAll('.product-item').forEach(item => {
        item.style.display = (cat === 'todos' || item.dataset.categoria === cat) ? 'block' : 'none';
      });
    });
  });

  // ── Modal consulta / compra ────────────────────────────
  const modalEl = document.getElementById('modalReserva');
  const modal = new bootstrap.Modal(modalEl);
  const form = document.getElementById('formReserva');
  const modalTitulo = document.getElementById('modalTituloTexto');
  const btnSubmit = document.getElementById('btnSubmitModal');
  const contenedorTalle = document.getElementById('contenedorTalle');
  const inputTalle = document.getElementById('clienteTalle');
  let productoSel = '', precioSel = '', tipoAccion = 'consulta';

  // Autocompletar desde localStorage
  const nombreGuardado = localStorage.getItem('joyeria_cliente_nombre');
  const telGuardado = localStorage.getItem('joyeria_cliente_telefono');
  if (nombreGuardado) document.getElementById('clienteNombre').value = nombreGuardado;
  if (telGuardado) document.getElementById('clienteTelefono').value = telGuardado;

  document.querySelectorAll('.btn-reservar').forEach(btn => {
    btn.addEventListener('click', function () {
      productoSel = this.dataset.nombre;
      precioSel = this.dataset.precio;
      tipoAccion = this.dataset.tipo || 'consulta';

      document.getElementById('itemReservaNombre').textContent = productoSel;
      document.getElementById('itemReservaPrecio').textContent = `$${parseInt(precioSel).toLocaleString('es-AR')}`;

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
        ? `¡Hola Paula! Soy *${nombre}* (${tel}).\n\nQuiero *comprar*:\n- *${productoSel}*\n- Medida: *${talle}*\n- Precio: $${parseInt(precioSel).toLocaleString('es-AR')}\n\n¿Cómo coordinamos el pago y el envío?`
        : `Hola Paula, soy *${nombre}* (${tel}).\n\nTe escribo desde la web, me interesa saber más sobre: *${productoSel}*. ¿Tenés disponibilidad? ¡Gracias!`;

      modal.hide();
      form.reset();
      document.getElementById('clienteNombre').value = nombre;
      document.getElementById('clienteTelefono').value = tel;

      window.open(`https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`, '_blank');
    });
  }

});