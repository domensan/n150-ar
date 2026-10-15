const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const catalog = JSON.parse(readFileSync(path.join(root, 'products.json'), 'utf8'));

async function page(search = '', ok = true) {
  const elements = Object.fromEntries(['ar-launcher', 'launch-ar', 'fallback', 'product', 'title', 'category', 'product-picker'].map(id => [id, {
    handlers: {}, children: [], hidden: false,
    addEventListener(event, handler) { this.handlers[event] = handler; },
    append(option) { this.children.push(option); }
  }]));
  const document = { querySelector: selector => elements[selector.slice(1)], createElement: () => ({}) };
  vm.runInNewContext(readFileSync(path.join(root, 'app.js'), 'utf8'), {
    document, window: { location: { search } }, URLSearchParams,
    fetch: async () => ({ ok, json: async () => catalog })
  });
  await new Promise(resolve => setImmediate(resolve));
  return { elements, document };
}

test('legacy and category links select only their own models; AR and load errors recover', async () => {
  for (const [query, category] of [['', 'nozzles'], ['?category=nozzles', 'nozzles'], ['?category=check-valves', 'check-valves']]) {
    const { elements: e, document } = await page(query);
    const model = e['ar-launcher'];
    const button = e['launch-ar'];
    assert.equal(e.product.children.length, catalog[category].products.length);
    assert.equal(e['product-picker'].hidden, category === 'check-valves');
    for (const item of catalog[category].products) {
      e.product.value = item.id;
      e.product.handlers.change();
      assert.equal(model.src, `./${item.src}`);
      assert.ok(existsSync(path.join(root, item.src)));
      assert.equal(model.orientation, item.orientation);
      assert.equal(document.title, `${item.name} · View in AR`);
      assert.equal(button.disabled, true);
      assert.equal(button.hidden, false);
      assert.equal(e.fallback.hidden, true);
      model.canActivateAR = false;
      model.handlers.load();
      assert.equal(button.hidden, true);
      assert.match(e.fallback.textContent, /not supported/);
      e.product.handlers.change();
      model.canActivateAR = true;
      model.handlers.load();
      assert.equal(button.disabled, false);
      model.activateAR = async () => {};
      await button.handlers.click();
      assert.equal(button.disabled, false);
      model.activateAR = async () => { throw new Error('cancelled'); };
      await button.handlers.click();
      assert.equal(button.disabled, false);
      assert.match(e.fallback.textContent, /could not be opened/);
      model.handlers.error();
      assert.match(e.fallback.textContent, /could not be loaded/);
      assert.equal(button.hidden, true);
    }
  }
});

test('unknown categories and catalog failures do not open unrelated products', async () => {
  for (const query of ['?category=missing', '?category=__proto__']) {
    const { elements: e } = await page(query);
    assert.equal(e.title.textContent, 'Category not found');
    assert.equal(e['ar-launcher'].src, undefined);
    assert.equal(e['launch-ar'].hidden, true);
  }
  const { elements: e } = await page('', false);
  assert.match(e.fallback.textContent, /catalog could not be loaded/);
});

test('R800CV export preserves real dimensions and has a grounded Y-up mesh', () => {
  const bytes = readFileSync(path.join(root, 'models/check-valves/r800cv.glb'));
  assert.equal(bytes.toString('ascii', 0, 4), 'glTF');
  const gltf = JSON.parse(bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)));
  const accessors = gltf.meshes.flatMap(mesh => mesh.primitives.map(p => gltf.accessors[p.attributes.POSITION]));
  const min = [0, 1, 2].map(i => Math.min(...accessors.map(a => a.min[i])));
  const max = [0, 1, 2].map(i => Math.max(...accessors.map(a => a.max[i])));
  const expected = [0.069596, 0.181779385, 0.0762];
  expected.forEach((size, i) => assert.ok(Math.abs(max[i] - min[i] - size) < 0.000001));
  assert.ok(Math.abs(min[1]) < 0.000001);
  assert.equal(gltf.materials.length, 4);
  for (const node of gltf.nodes.filter(n => n.mesh !== undefined)) {
    assert.equal(node.matrix, undefined);
    assert.equal(node.rotation, undefined);
    assert.equal(node.scale, undefined);
  }
});
