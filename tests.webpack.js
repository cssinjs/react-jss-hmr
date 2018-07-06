const tests = require.context('./src', true, /\.test\.js|$/)
tests.keys().forEach(tests)
