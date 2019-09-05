import React, { PureComponent } from 'react';

function withMount(Component, fnName) {
  return class loadDfspsCasHoc extends PureComponent {
    componentWillMount() {
      // select the mounting function and
      // run it only if set and correct typeof
      const fn = this.props[fnName];
      fn && typeof fn === 'function' && fn();
    }
    render() {
      return <Component {...this.props} />;
    }
  };
}
export { withMount };
