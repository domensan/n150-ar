const model = document.querySelector('#ar-launcher');
const launchButton = document.querySelector('#launch-ar');
const fallback = document.querySelector('#fallback');
const product = document.querySelector('#product');
const title = document.querySelector('#title');
const unsupportedMessage = 'Augmented reality is not supported on this device. You can explore the model in 3D here, or open this page on an AR-compatible phone.';
let loaded = false;

function showMessage(message) {
  launchButton.hidden = true;
  fallback.textContent = message;
  fallback.hidden = false;
}

function ready() {
  launchButton.disabled = false;
  launchButton.textContent = 'View in your space';
}

model.addEventListener('load', () => {
  loaded = true;
  if (!model.canActivateAR) {
    showMessage(unsupportedMessage);
    return;
  }
  launchButton.hidden = false;
  fallback.hidden = true;
  ready();
});
model.addEventListener('error', () => {
  loaded = false;
  showMessage('The 3D model could not be loaded. Check your connection and reload this page.');
});
launchButton.addEventListener('click', async () => {
  if (!loaded) return;
  launchButton.disabled = true;
  launchButton.textContent = 'Opening AR…';
  try {
    await model.activateAR();
  } catch {
    fallback.textContent = 'AR could not be opened. Please try again.';
    fallback.hidden = false;
  } finally {
    if (loaded) ready();
  }
});
model.addEventListener('ar-status', (event) => {
  if (event.detail.status === 'failed') {
    ready();
    launchButton.textContent = 'Try AR again';
  }
});

async function initialize() {
  try {
    const response = await fetch('./products.json');
    if (!response.ok) throw new Error('Catalog unavailable');
    const catalog = await response.json();
    const categoryId = new URLSearchParams(window.location.search).get('category') || 'nozzles';
    if (!Object.hasOwn(catalog, categoryId)) {
      title.textContent = 'Category not found';
      model.hidden = true;
      showMessage('This category is unavailable. Check the link or scan the catalog QR again.');
      return;
    }
    const category = catalog[categoryId];
    document.querySelector('#category').textContent = category.name;
    for (const item of category.products) {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.name;
      product.append(option);
    }
    document.querySelector('#product-picker').hidden = category.products.length < 2;
    function selectProduct() {
      const item = category.products.find(item => item.id === product.value);
      loaded = false;
      title.textContent = item.name;
      document.title = `${item.name} · View in AR`;
      launchButton.hidden = false;
      launchButton.disabled = true;
      launchButton.textContent = 'Preparing AR…';
      fallback.hidden = true;
      model.alt = `${item.name} at real-world scale`;
      model.orientation = item.orientation;
      model.src = `./${item.src}`;
    }
    product.addEventListener('change', selectProduct);
    product.value = category.products[0].id;
    selectProduct();
  } catch {
    showMessage('The product catalog could not be loaded. Check your connection and reload this page.');
  }
}
initialize();
