/* eslint-disable global-require */

import expect from 'expect.js'
import React from 'react'
import deepForceUpdate from 'react-deep-force-update'
import {hot} from 'react-hot-loader'
import injectSheet from './index'

describe('The HMR-aware HOC', () => {
  const TestComponent = classes => <button className={classes.button} />
  // rather than passing an actual module, which would require a webpack setup,
  // a stub with an id will do
  const moduleStub = {
    id: 999
  }

  it('should replace the static stylesheet', () => {
    const Version1 = hot(moduleStub)(injectSheet({button: {color: 'red'}})(TestComponent))
    const container = render(<Version1 />, node)

    expect(document.querySelectorAll('style').length).to.be(1)
    expect(document.querySelectorAll('style')[0].innerHTML).to.contain('color: red')

    hot(moduleStub)(injectSheet({button: {color: 'green'}})(TestComponent))
    deepForceUpdate(container)

    expect(document.querySelectorAll('style').length).to.be(1)
    expect(document.querySelectorAll('style')[0].innerHTML).to.contain('color: green')
  })

  it('should insert and remove dynamic stylesheets', () => {
    const Version1 = hot(moduleStub)(injectSheet({button: {color: 'blue'}})(TestComponent))
    const container = render(<Version1 />, node)

    expect(document.querySelectorAll('style').length).to.be(1)
    expect(document.querySelectorAll('style')[0].innerHTML).to.contain('color: blue')

    hot(moduleStub)(injectSheet({button: {color: 'yellow', fontStyle: () => 'italic'}})(TestComponent))
    deepForceUpdate(container)

    expect(document.querySelectorAll('style').length).to.be(2)
    expect(document.querySelectorAll('style')[0].innerHTML).to.contain('color: yellow')
    expect(document.querySelectorAll('style')[1].innerHTML).to.contain('font-style: italic')

    hot(moduleStub)(injectSheet({button: {color: 'purple'}})(TestComponent))
    deepForceUpdate(container)

    expect(document.querySelectorAll('style').length).to.be(1)
    expect(document.querySelectorAll('style')[0].innerHTML).to.contain('color: purple')
    expect(document.querySelectorAll('style')[0].innerHTML).not.to.contain('font-style: italic')
  })
})
