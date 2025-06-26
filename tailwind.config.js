module.exports = {
    content: ['./src/**/*.svelte'],
    safelist: [{
        pattern: /hljs+/,
    }],
    theme: {},
    variants: {},
    plugins: [require('tailwind-highlightjs')]
}