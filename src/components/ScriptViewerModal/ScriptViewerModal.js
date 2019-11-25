import React from 'react';
import { Button, Modal, ContentReader } from 'src/components';

class ScriptViewerModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({ modalOpen: true });
  }
  closeModal() {
    this.setState({ modalOpen: false });
  }

  render() {
    return (
      <div style={this.props.style}>
        <Button
          style={{ marginLeft: '10px', height: '45px' }}
          kind="primary"
          noFill
          icon="studio-project"
          disabled={this.props.disabled}
          onClick={this.openModal}
          label="View"
        />
        {this.state.modalOpen && (
          <Modal title={this.props.title} onClose={this.closeModal} primaryAction="Close" width="800px" flex>
            <ContentReader data={this.props.script} style={{ height: 300 }} />
          </Modal>
        )}
      </div>
    );
  }
}

export default ScriptViewerModal;
