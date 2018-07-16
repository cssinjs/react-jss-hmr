import defaultInjectSheet from 'react-jss'

const managers = new WeakMap()

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line no-console
  console.error('react-jss-hmr should never be used in production!')
}

export default function injectSheet(...rest) {
  const createHoc = defaultInjectSheet.apply(this, rest)
  return (InnerComponent) => {
    const Jss = createHoc(InnerComponent)

    class HotJss extends Jss {
      componentWillMount() {
        // Note: this will never be called during hot module replacement, so we can
        // use it as a place to store away the SheetManager
        super.componentWillMount()
        managers.set(Object.getPrototypeOf(this), this.manager)
      }

      componentWillReceiveProps(nextProps, nextContext) {
        super.componentWillReceiveProps(nextProps, nextContext)

        const prevManager = managers.get(Object.getPrototypeOf(this))
        const manager = this.manager
        if (prevManager !== manager) {
          // If the manager changed between mounting and updating, it was probably due to hot
          // module replacement.
          // In that case, we need to:
          //   1. Call createState() again because although the constructor called it, RHL
          //      restored the instance’s previous state so now the classes in the SheetsManager
          //      do not match those in this.state
          //   2. Call this.manage() so that the new SheetsManager will attach the new sheets
          //   3. Call unmanage() on the old SheetsManager to clean up the old sheets
          const {theme} = this.state
          const newState = this.createState({theme}, nextProps)
          this.manage(newState)
          this.setState(newState)
          // the new sheets have been attached now, so we can detach the old ones
          prevManager.unmanage(theme)
        }
      }

      componentDidUpdate(prevProps, prevState) {
        const key = Object.getPrototypeOf(this)
        const prevManager = managers.get(key)
        const manager = this.manager

        const isHmrUpdate = prevManager && prevManager !== manager
        if (isHmrUpdate) {
          managers.set(key, manager)
        }
        if (!isHmrUpdate || prevState.dynamicSheet) {
          // don't call when we don't have a previous dynamic sheet, otherwise it will throw if we
          // added a new dynamic sheet via hmr
          super.componentDidUpdate(prevProps, prevState)
        }
      }
    }

    return HotJss
  }
}
