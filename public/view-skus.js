document.addEventListener('DOMContentLoaded', () => {
    fetch('/skus')
      .then(response => response.json())
      .then(data => {
        const skuList = document.getElementById('skuList');
        data.forEach(sku => {
          const li = document.createElement('li');
          li.textContent = sku.sku;
          skuList.appendChild(li);
        });
      })
      .catch(error => console.error('Error:', error));
  });
  