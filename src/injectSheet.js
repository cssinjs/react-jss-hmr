import defaultInjectSheet from 'react-jss'

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line no-console
  console.error('react-jss-hmr should never be used in production!')
}

const managers = new WeakMap()
const deferredState = new WeakMap()

export default function injectSheet(...rest) {
  const createHoc = defaultInjectSheet.apply(this, rest)
  return (InnerComponent) => {
    const Jss = createHoc(InnerComponent)

    class HotJss extends Jss {
      constructor(props, context) {
        super(props, context)
        deferredState.set(this.manager, this.state)
      }

      componentWillMount() {
        // This will never be called during hot module replacement, so we can use it as a place to
        // store away the SheetManager
        super.componentWillMount()
        managers.set(Object.getPrototypeOf(this), this.manager)
      }

      componentWillReceiveProps(nextProps, nextContext) {
        super.componentWillReceiveProps(nextProps, nextContext)

        const key = Object.getPrototypeOf(this)
        const prevManager = managers.get(key)
        const manager = this.manager
        if (prevManager !== manager) {
          // If the manager changed between mounting and updating, it was probably due to hot
          // module replacement.
          // In that case, we need to:
          //   1. Restore the state created by the constructor, because RHL restored the instance’s
          //      previous state so now the classes in the SheetsManager do not match those in
          //      this.state
          //   2. Call this.manage() so that the new SheetsManager will attach the new sheets
          //   3. Call unmanage() on the previous SheetsManager to clean up the old sheets
          const prevTheme = this.state.theme
          const nextState = deferredState.get(manager)
          this.manage(nextState)
          this.setState(nextState)
          // the new sheets have been attached now, so we can detach the old ones
          prevManager.unmanage(prevTheme)
          // now start tracking the new manager, ready for next time
          managers.set(key, manager)
        }
        deferredState.delete(manager)
      }
    }

    return HotJss
  }
}
