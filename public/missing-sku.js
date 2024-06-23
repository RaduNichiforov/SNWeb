document.getElementById('skuForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const sku = document.getElementById('skuInput').value;
  const availabilityDate = document.getElementById('availabilityDate').value;

  fetch('/add-sku', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sku: sku, availabilityDate: availabilityDate })
  })
  .then(response => response.json())
  .then(data => {
      const messageDiv = document.getElementById('message');
      if (data.success) {
          messageDiv.innerHTML = `<span style="color: green;">${data.message}</span>`;
      } else {
          messageDiv.innerHTML = `<span style="color: red;">${data.message}</span>`;
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
});
