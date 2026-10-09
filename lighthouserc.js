module.exports = {
  ci: {
    collect: {
      url: [
        'https://ahmedsaturki.github.io/numuw-studio/',
        'https://ahmedsaturki.github.io/numuw-studio/landing/',
        'https://ahmedsaturki.github.io/numuw-studio/tools/',
        'https://ahmedsaturki.github.io/numuw-studio/products/',
        'https://ahmedsaturki.github.io/numuw-studio/landing/manufacturing/',
        'https://ahmedsaturki.github.io/numuw-studio/tools/diagnostic/',
      ],
      numberOfRuns: 3,
      settings: {
        headless: true,
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:pwa': ['off'],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};