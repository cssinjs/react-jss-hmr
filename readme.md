# Hot module replacement with JSS and React

React-JSS-HMR enhances [react-jss][1] to support hot CSS updates in conjunction with [react-hot-loader][2].

## 🤔 Do you really need this?

Hot reloading is possible (and much simpler) without this package. This package is **only**
necessary if you are using react-hot-loader. And, you probably don’t need react-hot-loader
either. Consider this [quote][5] from Dan Abramov (the creator of react-hot-loader):

> However if you ... use something like Redux, I strongly suggest you to consider using vanilla HMR
> API instead of React Hot Loader, React Transform, or other similar projects. It’s just so much
> simpler—at least, it is today.

With Redux, “vanilla” HMR looks something like this:

```javascript
const store = createStore(getPreloadedState())
const rootEl = document.getElementById('root')

const render = App => (
  <ReduxProvider store={store}>
    <JssProvider>
      <App />
    </JssProvider>
  </ReduxProvider>
)

ReactDOM.hydrate(render(App), rootEl)

if (module.hot) {
  module.hot.accept('./components/App', function () {
    const App = require('./components/App').default
    ReactDOM.render(render(App), rootEl)
  })
}
```

Because your Redux state is retained when the hot reload occurs, these hot reloads look just as 🔥.

If you’re switching away from react-hot-loader (even just to try out the above vanilla setup), don’t
forget to delete its babel plugin (`react-hot-loader/babel`) from your configuration!

## Install

### Webpack v4

```
npm install --save-dev react-jss-hmr react-hot-loader
```

```
yarn add -D react-jss-hmr react-hot-loader
```

### Webpack v3

Webpack v3 is no longer supported as of version 1.0.0, so you’ll need to install version 0.1.x.

```
npm install --save-dev react-jss-hmr@^0.1.3 react-hot-loader
```

```
yarn add -D react-jss-hmr@^0.1.3 react-hot-loader
```

## Usage

First, set up [react-hot-loader][2] and make sure it’s working in your project.
   
Then, add the following to your webpack development config:

```javascript 1.8
const ReactJssHmrPlugin = require('react-jss-hmr/webpack')
//...
module.exports = {
  //...
  resolve: {
    plugins: [
      new ReactJssHmrPlugin()
    ]
  }
}
```

> **⚠️ NOTE:** the plugin is added to the `resolve` section in the webpack config, not the main 
> `plugins` section!

Now you should be able to tweak the CSS rules in your `injectSheet()` calls and see the changes 
reflected in your browser without reloading.

## Contributing

See our [contribution guidelines](./contributing.md).

## License

MIT

[1]: https://github.com/cssinjs/react-jss
[2]: https://github.com/gaearon/react-hot-loader
[3]: https://lodash.com/docs#flow
[4]: https://github.com/acdlite/recompose/blob/master/docs/API.md#compose
[5]: https://medium.com/@dan_abramov/hot-reloading-in-react-1140438583bf
