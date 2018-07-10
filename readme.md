# Hot module replacement with JSS and React

React-JSS-HMR enhances [react-jss][1] to support hot CSS updates during development.

## Install

```
npm install --save-dev react-jss-hmr react-hot-loader
```

```
yarn add -D react-jss-hmr react-hot-loader
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
