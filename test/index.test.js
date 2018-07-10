/* eslint-disable global-require */

import expect from 'expect.js'
import React from 'react'
import deepForceUpdate from 'react-deep-force-update'
// Importing 'react-hot-loader' will give us the production build because module.hot is undefined.
// We are specifically testing hot reloading so rather than attempting to run webpack over this
// source file let’s just include the development version directly
import {hot} from 'react-hot-loader/dist/react-hot-loader.development'
import {mount} from 'enzyme'
import injectSheet from '../src/index'

describe('The HMR-aware HOC', () => {
  const TestComponent = classes => <button className={classes.button} />
  // rather than passing an actual module, which would require a webpack setup,
  // a stub with an id will do
  const moduleStub = {
    id: 999
  }

  it('should replace the static stylesheet', () => {
    const Version1 = hot(moduleStub)(injectSheet({button: {color: 'red'}})(TestComponent))
    const wrapper = mount(<Version1 />)

    expect(document.querySelectorAll('style').length).to.be(1)
    expect(document.querySelectorAll('style')[0].innerHTML).to.contain('color: red')

    hot(moduleStub)(injectSheet({button: {color: 'green'}})(TestComponent))
    deepForceUpdate(wrapper.instance())

    expect(document.querySelectorAll('style').length).to.be(1)
    expect(document.querySelectorAll('style')[0].innerHTML).to.contain('color: green')

    wrapper.unmount()
  })

  it('should insert and remove dynamic stylesheets', () => {
    const Version1 = hot(moduleStub)(injectSheet({button: {color: 'blue'}})(TestComponent))
    const wrapper = mount(<Version1 />)

    expect(document.querySelectorAll('style').length).to.be(1)
    expect(document.querySelectorAll('style')[0].innerHTML).to.contain('color: blue')

    hot(moduleStub)(injectSheet({button: {color: 'yellow', fontStyle: () => 'italic'}})(TestComponent))
    deepForceUpdate(wrapper.instance())

    expect(document.querySelectorAll('style').length).to.be(2)
    expect(document.querySelectorAll('style')[0].innerHTML).to.contain('color: yellow')
    expect(document.querySelectorAll('style')[1].innerHTML).to.contain('font-style: italic')

    hot(moduleStub)(injectSheet({button: {color: 'purple'}})(TestComponent))
    deepForceUpdate(wrapper.instance())

    expect(document.querySelectorAll('style').length).to.be(1)
    expect(document.querySelectorAll('style')[0].innerHTML).to.contain('color: purple')
    expect(document.querySelectorAll('style')[0].innerHTML).not.to.contain('font-style: italic')

    wrapper.unmount()
  })
})
