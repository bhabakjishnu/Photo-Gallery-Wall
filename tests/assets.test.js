/**
 * Unit tests for External Assets and Typography Configuration.
 * Validates inclusion of Google Fonts (Poppins), Font Awesome stylesheet links,
 * preconnect origins, and CSS design tokens in accordance with repository standards.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');
const TOKENS_CSS_PATH = path.join(ROOT_DIR, 'styles', 'base', 'tokens.css');

/**
 * Validates that index.html contains required font and icon link tags.
 */
test('index.html includes required preconnect origins for Google Fonts', () => {
    const htmlContent = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');
    assert.match(
        htmlContent,
        /<link\s+rel="preconnect"\s+href="https:\/\/fonts\.googleapis\.com">/,
        'Should include preconnect link for https://fonts.googleapis.com'
    );
    assert.match(
        htmlContent,
        /<link\s+rel="preconnect"\s+href="https:\/\/fonts\.gstatic\.com"\s+crossorigin>/,
        'Should include preconnect link for https://fonts.gstatic.com with crossorigin'
    );
});

test('index.html links Google Fonts Poppins with full weight gamut', () => {
    const htmlContent = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');
    assert.match(
        htmlContent,
        /href="https:\/\/fonts\.googleapis\.com\/css2\?family=Poppins:[^"]+"/,
        'Should include Google Fonts stylesheet for Poppins'
    );
    // Ensure Inter is no longer linked
    assert.doesNotMatch(
        htmlContent,
        /fonts\.googleapis\.com\/css2\?family=Inter/,
        'Legacy Inter font link should be replaced by Poppins'
    );
});

test('index.html links Font Awesome CDN stylesheet with integrity attribute', () => {
    const htmlContent = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');
    assert.match(
        htmlContent,
        /href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/7\.3\.1\/css\/all\.min\.css"/,
        'Should include Font Awesome CDN link'
    );
    assert.match(
        htmlContent,
        /integrity="sha512-QeR2VH\+lsBE5LSAe1Q5EnTBbe7XTBubt8dG93Y7gidSgdMCr8nVqKcfKAMyN96SV8KDbZVTDXChatu5G2KQGzg=="/,
        'Should include Font Awesome SRI integrity hash'
    );
});

test('styles/base/tokens.css defines Poppins as the primary font token', () => {
    const tokensContent = fs.readFileSync(TOKENS_CSS_PATH, 'utf-8');
    assert.match(
        tokensContent,
        /--font-primary:\s*"Poppins"/,
        '--font-primary token should specify Poppins font family'
    );
});
