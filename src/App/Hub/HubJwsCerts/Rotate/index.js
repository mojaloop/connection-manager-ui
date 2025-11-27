import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'components';
import { rotateJwsCerts } from './actions';
import {
  getRotateJWSCertsPending
} from './selectors';
import { withMount } from 'utils/hocs';

const HubJwsCertsRotate = ({
  isLoading,
  onRotate
}) => {
  const handleRotate = () => {
    onRotate();
  };

  return (
    <div>
      <Button
        onClick={handleRotate}
        disabled={isLoading}
        pending={isLoading}
        label="Rotate Hub JWS Certificates"
      >
      </Button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoading: getRotateJWSCertsPending(state),
});

const mapDispatchToProps = (dispatch) => ({
  onRotate: () => dispatch(rotateJwsCerts()),
});

const MountedHubJwsCertsRotate = withMount(HubJwsCertsRotate, 'onMount');
export default connect(mapStateToProps, mapDispatchToProps)(MountedHubJwsCertsRotate);
