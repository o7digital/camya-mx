document.querySelectorAll('.local-contact-form').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    let status = form.querySelector('.local-submit-status');
    if (!status) {
      status = document.createElement('p');
      status.className = 'local-submit-status';
      status.setAttribute('role', 'status');
      form.append(status);
    }
    status.textContent = document.documentElement.lang.startsWith('en')
      ? 'Sending is not connected in this test copy. No message has been sent.'
      : 'El envío no está conectado en esta copia de prueba. No se ha enviado ningún mensaje.';
  });
});
