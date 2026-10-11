/**
 * Unit tests for Lumina Theme Management.
 * Validates default light mode behavior, user toggling, localStorage persistence,
 * and accessibility ARIA label updates.
 */

const test = require('node:test');
const assert = require('node:assert/strict');

/**
 * Creates a lightweight DOM environment mock for testing theme switching.
 *
 * @param {string|null} storedTheme - Optional pre-existing localStorage theme.
 * @returns {object} Mock environment references and helper methods.
 */
function createDomEnvironment(storedTheme = null) {
    const storage = {};
    if (storedTheme !== null) {
        storage['lumina-theme'] = storedTheme;
    }

    const docAttributes = {
        'data-theme': 'light'
    };

    const clickListeners = [];
    const themeBtn = {
        attributes: {
            'aria-label': 'Switch to dark mode'
        },
        setAttribute(name, value) {
            this.attributes[name] = String(value);
        },
        getAttribute(name) {
            return this.attributes[name] || null;
        },
        addEventListener(event, handler) {
            if (event === 'click') clickListeners.push(handler);
        },
        click() {
            clickListeners.forEach(fn => fn());
        }
    };

    const metaThemeColor = {
        attributes: {
            content: '#f8f9fa'
        },
        setAttribute(name, value) {
            this.attributes[name] = String(value);
        },
        getAttribute(name) {
            return this.attributes[name] || null;
        }
    };

    global.localStorage = {
        getItem(key) {
            return storage[key] !== undefined ? storage[key] : null;
        },
        setItem(key, value) {
            storage[key] = String(value);
        },
        clear() {
            Object.keys(storage).forEach(k => delete storage[k]);
        }
    };

    global.document = {
        documentElement: {
            setAttribute(name, value) {
                docAttributes[name] = String(value);
            },
            getAttribute(name) {
                return docAttributes[name] || null;
            }
        },
        getElementById(id) {
            if (id === 'theme-toggle') return themeBtn;
            return null;
        },
        querySelector(selector) {
            if (selector.includes('meta[name="theme-color"]')) return metaThemeColor;
            return null;
        },
        addEventListener() {}
    };

    global.window = {
        matchMedia() {
            return { matches: true }; // Simulates OS dark mode preference
        }
    };

    return {
        themeBtn,
        metaThemeColor,
        getDocAttributes: () => docAttributes,
        getStorage: () => storage
    };
}

// Import module under test
const { initTheme } = require('../scripts/gallery.js');

test('defaults to light mode when no localStorage theme is saved, even if OS prefers dark', () => {
    const env = createDomEnvironment(null);
    initTheme();

    assert.equal(env.getDocAttributes()['data-theme'], 'light');
    assert.equal(env.themeBtn.getAttribute('aria-label'), 'Switch to dark mode');
    assert.equal(env.metaThemeColor.getAttribute('content'), '#f8f9fa');
});

test('respects explicit saved dark theme from localStorage on load', () => {
    const env = createDomEnvironment('dark');
    initTheme();

    assert.equal(env.getDocAttributes()['data-theme'], 'dark');
    assert.equal(env.themeBtn.getAttribute('aria-label'), 'Switch to light mode');
    assert.equal(env.metaThemeColor.getAttribute('content'), '#0d0f12');
});

test('respects explicit saved light theme from localStorage on load', () => {
    const env = createDomEnvironment('light');
    initTheme();

    assert.equal(env.getDocAttributes()['data-theme'], 'light');
    assert.equal(env.themeBtn.getAttribute('aria-label'), 'Switch to dark mode');
    assert.equal(env.metaThemeColor.getAttribute('content'), '#f8f9fa');
});

test('toggles from default light to dark mode and saves to localStorage', () => {
    const env = createDomEnvironment(null);
    initTheme();

    // Trigger toggle button click
    env.themeBtn.click();

    assert.equal(env.getDocAttributes()['data-theme'], 'dark');
    assert.equal(env.getStorage()['lumina-theme'], 'dark');
    assert.equal(env.themeBtn.getAttribute('aria-label'), 'Switch to light mode');
    assert.equal(env.metaThemeColor.getAttribute('content'), '#0d0f12');
});

test('toggles back from dark to light mode and saves to localStorage', () => {
    const env = createDomEnvironment('dark');
    initTheme();

    // Trigger toggle button click
    env.themeBtn.click();

    assert.equal(env.getDocAttributes()['data-theme'], 'light');
    assert.equal(env.getStorage()['lumina-theme'], 'light');
    assert.equal(env.themeBtn.getAttribute('aria-label'), 'Switch to dark mode');
    assert.equal(env.metaThemeColor.getAttribute('content'), '#f8f9fa');
});
