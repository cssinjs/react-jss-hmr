const expect = require('expect.js')
const {ResolverFactory} = require('enhanced-resolve')
const MemoryFileSystem = require('memory-fs')
const ReactJssHmrPlugin = require('../webpack')

describe('The Webpack resolve plugin', () => {
  let resolver

  beforeEach(() => {
    const buf = Buffer.from('')
    const fileSystem = new MemoryFileSystem({
      '': true,
      'react-jss': {
        '': true,
        index: buf
      },
      'react-jss-hmr': {
        '': true,
        index: buf
      }
    })

    resolver = ResolverFactory.createResolver({
      modules: '/',
      useSyncFileSystemCalls: true,
      fileSystem,
      plugins: [
        new ReactJssHmrPlugin()
      ]
    })
  })

  it('should normally alias "react-jss" as "react-jss-hmr"', () => {
    expect(resolver.resolveSync({
      issuer: 'some/other/place'
    }, '/', 'react-jss')).to.be('/react-jss-hmr/index')
  })

  it('should not alias "react-jss" from within the "react-jss-hmr" package', () => {
    expect(resolver.resolveSync({
      issuer: 'react-jss-hmr/lib/injectSheet.js'
    }, '/', 'react-jss')).to.be('/react-jss/index')
  })
})
