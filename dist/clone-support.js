document.querySelectorAll('.local-contact-form').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const body = [...data].map(([key, value]) => `${key}: ${value}`).join('\n');
    window.location.href = `mailto:info@camya.mx?subject=${encodeURIComponent('Consulta CAMYA')}&body=${encodeURIComponent(body)}`;
  });
});
