/**
 * Unit tests for External Assets, Typography Configuration, and Icon Placements.
 * Validates inclusion of Google Fonts (Poppins), Font Awesome stylesheet links,
 * preconnect origins, CSS design tokens, and correct positioning of Font Awesome icons.
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

test('index.html integrates Font Awesome icons in theme toggle and navigation', () => {
    const htmlContent = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');
    assert.match(htmlContent, /class="[^"]*fa-sun[^"]*"/, 'Theme toggle should contain fa-sun');
    assert.match(htmlContent, /class="[^"]*fa-moon[^"]*"/, 'Theme toggle should contain fa-moon');
    assert.match(htmlContent, /class="[^"]*fa-house[^"]*"/, 'Navigation should contain fa-house');
    assert.match(htmlContent, /class="[^"]*fa-star[^"]*"/, 'Navigation should contain fa-star');
    assert.match(htmlContent, /class="[^"]*fa-compass[^"]*"/, 'Navigation should contain fa-compass');
    assert.match(htmlContent, /class="[^"]*fa-circle-info[^"]*"/, 'Navigation should contain fa-circle-info');
});

test('index.html integrates Font Awesome icons in category filter buttons', () => {
    const htmlContent = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');
    assert.match(htmlContent, /class="[^"]*fa-border-all[^"]*"/, 'Filter bar should contain fa-border-all');
    assert.match(htmlContent, /class="[^"]*fa-building[^"]*"/, 'Filter bar should contain fa-building');
    assert.match(htmlContent, /class="[^"]*fa-couch[^"]*"/, 'Filter bar should contain fa-couch');
    assert.match(htmlContent, /class="[^"]*fa-city[^"]*"/, 'Filter bar should contain fa-city');
    assert.match(htmlContent, /class="[^"]*fa-shapes[^"]*"/, 'Filter bar should contain fa-shapes');
});

test('index.html equips all 12 gallery cards with Font Awesome expand and location icons', () => {
    const htmlContent = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');
    const expandMatches = htmlContent.match(/class="[^"]*fa-expand[^"]*"/g) || [];
    const locationMatches = htmlContent.match(/class="[^"]*fa-location-dot[^"]*"/g) || [];
    assert.equal(expandMatches.length, 12, 'All 12 cards should have fa-expand corner badge');
    assert.ok(locationMatches.length >= 12, 'Cards should feature fa-location-dot');
});

test('index.html integrates Font Awesome icons in features, lightbox, and footer', () => {
    const htmlContent = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');
    assert.match(htmlContent, /class="[^"]*fa-layer-group[^"]*"/, 'Features should contain fa-layer-group');
    assert.match(htmlContent, /class="[^"]*fa-cubes[^"]*"/, 'Features should contain fa-cubes');
    assert.match(htmlContent, /class="[^"]*fa-bolt[^"]*"/, 'Features should contain fa-bolt');
    assert.match(htmlContent, /class="[^"]*fa-xmark[^"]*"/, 'Lightbox should contain fa-xmark close icon');
    assert.match(htmlContent, /class="[^"]*fa-chevron-left[^"]*"/, 'Lightbox should contain fa-chevron-left');
    assert.match(htmlContent, /class="[^"]*fa-chevron-right[^"]*"/, 'Lightbox should contain fa-chevron-right');
    assert.match(htmlContent, /class="[^"]*fa-arrow-up[^"]*"/, 'Footer should contain fa-arrow-up');
    assert.match(htmlContent, /class="[^"]*fa-github[^"]*"/, 'Footer social should contain fa-github');
});

test('decorative icon elements enforce aria-hidden="true" accessibility attribute', () => {
    const htmlContent = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');
    const iconTags = htmlContent.match(/<i\s+class="[^"]*fa-[^"]*"[^>]*>/g) || [];
    assert.ok(iconTags.length > 20, 'Should find multiple Font Awesome <i> tags');
    for (const tag of iconTags) {
        assert.ok(
            tag.includes('aria-hidden="true"'),
            `Decorative icon tag "${tag}" must have aria-hidden="true" attribute`
        );
    }
});
