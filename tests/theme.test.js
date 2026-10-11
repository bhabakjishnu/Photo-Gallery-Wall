/**
 * Unit tests for Lumina Theme Management.
 * Validates default light mode behavior on fresh visits, purging of legacy localStorage dark overrides,
 * user toggling within the active session, sessionStorage persistence,
 * and accessibility ARIA label updates.
 */

const test = require('node:test');
const assert = require('node:assert/strict');

/**
 * Creates a lightweight DOM environment mock for testing theme switching.
 *
 * @param {string|null} storedSessionTheme - Optional pre-existing sessionStorage theme.
 * @param {string|null} storedLegacyLocalTheme - Optional pre-existing legacy localStorage theme.
 * @returns {object} Mock environment references and helper methods.
 */
function createDomEnvironment(storedSessionTheme = null, storedLegacyLocalTheme = null) {
    const sessionStorageStore = {};
    if (storedSessionTheme !== null) {
        sessionStorageStore['lumina-theme'] = storedSessionTheme;
    }

    const localStorageStore = {};
    if (storedLegacyLocalTheme !== null) {
        localStorageStore['lumina-theme'] = storedLegacyLocalTheme;
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

    global.sessionStorage = {
        getItem(key) {
            return sessionStorageStore[key] !== undefined ? sessionStorageStore[key] : null;
        },
        setItem(key, value) {
            sessionStorageStore[key] = String(value);
        },
        removeItem(key) {
            delete sessionStorageStore[key];
        },
        clear() {
            Object.keys(sessionStorageStore).forEach(k => delete sessionStorageStore[k]);
        }
    };

    global.localStorage = {
        getItem(key) {
            return localStorageStore[key] !== undefined ? localStorageStore[key] : null;
        },
        setItem(key, value) {
            localStorageStore[key] = String(value);
        },
        removeItem(key) {
            delete localStorageStore[key];
        },
        clear() {
            Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]);
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
        getSessionStorage: () => sessionStorageStore,
        getLocalStorage: () => localStorageStore
    };
}

// Import module under test
const { initTheme } = require('../scripts/gallery.js');

test('defaults to light mode when opening with no saved theme, even if OS prefers dark', () => {
    const env = createDomEnvironment(null, null);
    initTheme();

    assert.equal(env.getDocAttributes()['data-theme'], 'light');
    assert.equal(env.themeBtn.getAttribute('aria-label'), 'Switch to dark mode');
    assert.equal(env.metaThemeColor.getAttribute('content'), '#f8f9fa');
});

test('purges legacy localStorage dark override and defaults to light mode on open', () => {
    const env = createDomEnvironment(null, 'dark');
    initTheme();

    // Legacy localStorage should be purged
    assert.equal(env.getLocalStorage()['lumina-theme'], undefined);
    // Page must open in light mode
    assert.equal(env.getDocAttributes()['data-theme'], 'light');
    assert.equal(env.themeBtn.getAttribute('aria-label'), 'Switch to dark mode');
    assert.equal(env.metaThemeColor.getAttribute('content'), '#f8f9fa');
});

test('respects explicit active session dark theme on reload', () => {
    const env = createDomEnvironment('dark', null);
    initTheme();

    assert.equal(env.getDocAttributes()['data-theme'], 'dark');
    assert.equal(env.themeBtn.getAttribute('aria-label'), 'Switch to light mode');
    assert.equal(env.metaThemeColor.getAttribute('content'), '#0d0f12');
});

test('respects explicit active session light theme on reload', () => {
    const env = createDomEnvironment('light', null);
    initTheme();

    assert.equal(env.getDocAttributes()['data-theme'], 'light');
    assert.equal(env.themeBtn.getAttribute('aria-label'), 'Switch to dark mode');
    assert.equal(env.metaThemeColor.getAttribute('content'), '#f8f9fa');
});

test('toggles from default light to dark mode and saves to active sessionStorage', () => {
    const env = createDomEnvironment(null, null);
    initTheme();

    // Trigger toggle button click
    env.themeBtn.click();

    assert.equal(env.getDocAttributes()['data-theme'], 'dark');
    assert.equal(env.getSessionStorage()['lumina-theme'], 'dark');
    assert.equal(env.themeBtn.getAttribute('aria-label'), 'Switch to light mode');
    assert.equal(env.metaThemeColor.getAttribute('content'), '#0d0f12');
});

test('toggles back from dark to light mode and updates active sessionStorage', () => {
    const env = createDomEnvironment('dark', null);
    initTheme();

    // Trigger toggle button click
    env.themeBtn.click();

    assert.equal(env.getDocAttributes()['data-theme'], 'light');
    assert.equal(env.getSessionStorage()['lumina-theme'], 'light');
    assert.equal(env.themeBtn.getAttribute('aria-label'), 'Switch to dark mode');
    assert.equal(env.metaThemeColor.getAttribute('content'), '#f8f9fa');
});
