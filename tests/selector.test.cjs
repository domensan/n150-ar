const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

test('each product switches its asset and recovers from unsupported AR', () => {
  const root = path.join(__dirname, '..');
  const html = readFileSync(path.join(root, 'index.html'), 'utf8');
  const elements = Object.fromEntries(['ar-launcher', 'launch-ar', 'fallback', 'product', 'title'].map(id => [id, {
    handlers: {}, addEventListener(event, handler) { this.handlers[event] = handler; }
  }]));
  const document = { querySelector: selector => elements[selector.slice(1)] };
  vm.runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], { document });
  const model = elements['ar-launcher'];
  const button = elements['launch-ar'];
  const options = [...html.matchAll(/<option value="([^"]+)" data-orientation="([^"]+)">([^<]+)<\/option>/g)];
  assert.equal(options.length, 4);
  assert.ok(!html.includes('ios-src='));
  for (const [, value, orientation, name] of options) {
    elements.product.selectedOptions = [{ value, dataset: { orientation }, textContent: name }];
    elements.product.handlers.change();
    assert.equal(model.src, `./${value}`);
    assert.ok(existsSync(path.join(root, value)));
    assert.equal(model.orientation, orientation);
    assert.equal(document.title, `${name} · View in AR`);
    assert.equal(button.disabled, true);
    assert.equal(button.hidden, false);
    assert.equal(elements.fallback.hidden, true);
    model.canActivateAR = true;
    model.handlers.load();
    assert.equal(button.disabled, false);
    model.canActivateAR = false;
    model.handlers.load();
    assert.equal(button.hidden, true);
    assert.equal(elements.fallback.hidden, false);
  }
});
