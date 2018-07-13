import defaultInjectSheet from 'react-jss'

const managers = new WeakMap()

export default process.env.NODE_ENV !== 'production'
  ? function injectSheet(...rest) {
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
            // In that case, we need to recreate our sheets now. Then we can remove the old ones in
            // componentDidUpdate().
            const {theme} = this.state
            const newState = this.createState({theme}, nextProps)
            this.manage(newState)
            this.setState(newState)
          }
        }

        componentDidUpdate(prevProps, prevState) {
          const key = Object.getPrototypeOf(this)
          const prevManager = managers.get(key)
          const manager = this.manager
          // If the manager changed between mounting and updating, it was probably due to hot module
          // replacement.
          // We remove previous sheets after new ones have been created to avoid FOUC.
          const isHmrUpdate = prevManager && prevManager !== manager
          if (isHmrUpdate) {
            prevManager.unmanage(this.state.theme)
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
  : defaultInjectSheet
