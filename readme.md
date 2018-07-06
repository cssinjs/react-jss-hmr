# Hot module replacement with JSS and React

React-JSS-HMR enhances [react-jss](https://github.com/cssinjs/react-jss) to support hot updates to
your CSS during development.

## Install

```
npm install --save-dev react-jss-hmr
```

```
yarn add -D react-jss-hmr
```

## Usage

Add the following to your webpack development config:

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

## Contributing

See our [contribution guidelines](./contributing.md).

## License

MIT
