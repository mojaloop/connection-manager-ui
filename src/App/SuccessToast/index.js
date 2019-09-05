import { PureComponent } from 'react';
import { Toast } from 'components';

class SuccessToast extends PureComponent {
  componentWillReceiveProps(nextProps) {
    if (nextProps.isVisible) {
      Toast.show({
        kind: 'success',
        closeable: true,
        title: 'Saved Successfully',
      });
    }
  }
  render() {
    return null;
  }
}

export default SuccessToast;
