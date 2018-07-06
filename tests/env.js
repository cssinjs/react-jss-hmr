/* eslint-disable global-require */

function reloadModules() {
  Object.keys(require.cache).forEach(key => delete require.cache[key])
  loadModules()
}

function loadModules() {
  const ReactDom = require('react-dom')
  window.render = ReactDom.render
  window.unmountComponentAtNode = ReactDom.unmountComponentAtNode
}

function reset() {
  unmountComponentAtNode(node)
  reloadModules()
  node.parentNode.removeChild(node)
}

beforeEach(() => {
  window.node = document.body.appendChild(document.createElement('div'))
})

afterEach(reset)

loadModules()
