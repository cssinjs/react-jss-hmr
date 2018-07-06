/**
 * To use this package, users could almost use the webpack alias setting:
 *
 *  resolve: {
 *    alias: {
 *      'react-jss': 'react-jss-hmr'
 *    }
 *  }
 *
 * But that configuration causes infinite recursion, because this package
 * calls require('react-jss') internally, which gets resolved to react-jss-hmr
 * as well.
 *
 * So, this plugin is just the same as webpack's internal AliasPlugin except:
 *
 *   1. It is preconfigured to alias react-jss as react-jss-hmr;
 *   2. It also avoids aliasing react-jss from within this package.
 *
 */
export default class ReactJssHmrPlugin {
  apply(resolver) { // eslint-disable-line class-methods-use-this
    resolver.plugin('described-resolve', (request, callback) => {
      if (process.env.NODE_ENV !== 'production' &&
          request.request === 'react-jss' &&
          request.context &&
          request.context.issuer &&
          request.context.issuer.split(/[/\\]/).indexOf('react-jss-hmr') < 0
      ) {
        const aliasedRequest = Object.assign({}, request, {
          request: 'react-jss-hmr'
        })
        return resolver.doResolve(
          'resolve',
          aliasedRequest,
          'aliased react-jss to react-jss-hmr',
          callback
        )
      }
      return callback()
    })
  }
}
