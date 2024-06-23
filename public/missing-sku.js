function addSku() {
  const skuInput = document.getElementById('skuInput');
  const message = document.getElementById('message');
  const sku = skuInput.value.trim();

  if (sku === '') {
    message.textContent = 'Please enter an SKU.';
    return;
  }

  fetch('/add-sku', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sku })
  })
  .then(response => response.json())
  .then(data => {
    message.textContent = data.message;
  })
  .catch(error => {
    console.error('Error:', error);
    message.textContent = 'An error occurred.';
  });

  skuInput.value = ''; // Clear the input field
}
