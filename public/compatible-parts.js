let unitPartsData = {};

// Fetch JSON data
fetch('unit_parts.json')
  .then(response => response.json())
  .then(data => {
    unitPartsData = data;
    console.log('Data loaded:', unitPartsData);
  })
  .catch(error => console.error('Error loading JSON:', error));

function filterUnits() {
  const searchBar = document.getElementById('searchBar');
  const partTypeDropdown = document.getElementById('partTypeDropdown');
  const results = document.getElementById('results');
  const searchTerm = searchBar.value.toLowerCase().trim();
  const selectedPartType = partTypeDropdown.value.toLowerCase();

  console.log(`Searching for model: ${searchTerm}, with part type: ${selectedPartType}`);

  results.innerHTML = ''; // Clear previous results

  if (unitPartsData[searchTerm]) {
    const filteredParts = unitPartsData[searchTerm].filter(part => {
      if (!part.category) return false;
      const partCategory = part.category.toLowerCase();
      if (selectedPartType === 'accessories') {
        return !['motor', 'dust cup', 'handle & hose', 'wand', 'floor nozzle'].includes(partCategory);
      } else {
        return partCategory.includes(selectedPartType);
      }
    });

    if (filteredParts.length > 0) {
      const partsGroupedByCategory = groupBy(filteredParts, 'category');
      for (const category in partsGroupedByCategory) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group';

        const groupTitle = document.createElement('h2');
        groupTitle.textContent = category;
        groupDiv.appendChild(groupTitle);

        partsGroupedByCategory[category].forEach(part => {
          const partDiv = document.createElement('div');
          partDiv.className = 'part';
          partDiv.textContent = `${part.code}`;

          const copyButton = document.createElement('button');
          copyButton.textContent = 'Copy';
          copyButton.onclick = () => copyToClipboard(part.code);
          copyButton.className = 'copy-button';

          const partContainer = document.createElement('div');
          partContainer.className = 'part-container';
          partContainer.appendChild(partDiv);
          partContainer.appendChild(copyButton);

          groupDiv.appendChild(partContainer);
        });

        results.appendChild(groupDiv);
      }
    } else {
      results.textContent = 'No matching parts found.';
    }
  } else {
    results.textContent = 'Model not found.';
  }
}

function groupBy(array, key) {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
    return result;
  }, {});
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied to clipboard: ' + text);
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}
