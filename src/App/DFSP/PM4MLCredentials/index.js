import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Button, FormInput, MessageBox, Modal, Spinner } from 'components';
import { getDfspId, getDfspName } from 'App/selectors';
import { getIsCurrentUserDfspUser } from 'Auth/selectors';
import { 
  checkDfspCredentials, 
  fetchDfspCredentials, 
  createDfspCredentials, 
  clearDfspCredentialsState,
} from './actions';
import { 
  getDoCredentialsExist, 
  getIsDfspCredentialsPending,
  getDfspCredentialsError,
} from './selectors';
import './PM4MLCredentials.css';

const stateProps = state => ({
  dfspId: getDfspId(state),
  dfspName: getDfspName(state),
  credentialsExist: getDoCredentialsExist(state),
  isPending: getIsDfspCredentialsPending(state),
  error: getDfspCredentialsError(state),
  isCurrentUserDfspUser: getIsCurrentUserDfspUser(state),
});

const actionProps = dispatch => ({
  onCheckCredentials: (dfspId) => dispatch(checkDfspCredentials(dfspId)),
  onFetchCredentials: (dfspId) => dispatch(fetchDfspCredentials(dfspId)),
  onCreateCredentials: (dfspId) => dispatch(createDfspCredentials(dfspId)),
  onClearState: () => dispatch(clearDfspCredentialsState()),
});

const PM4MLCredentials = ({
  dfspId,
  dfspName,
  credentialsExist,
  isPending,
  error,
  isCurrentUserDfspUser,
  onCheckCredentials,
  onFetchCredentials,
  onCreateCredentials,
  onClearState,
}) => {
  // Local state for credentials (never stored in Redux)
  const [credentials, setCredentials] = useState(null);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);

  // Clear credentials from memory when component unmounts
  useEffect(() => {
    return () => {
      setCredentials(null);
      onClearState();
    };
  }, [onClearState]);

  // Check if credentials exist on component mount
  useEffect(() => {
    if (dfspId && isInitialLoad) {
      onCheckCredentials(dfspId);
      setIsInitialLoad(false);
    }
  }, [dfspId, isInitialLoad, onCheckCredentials]);

  const loadCredentials = useCallback(async () => {
    setIsLoadingCredentials(true);
    try {
      const fetchedCredentials = await onFetchCredentials(dfspId);
      if (fetchedCredentials) {
        setCredentials(fetchedCredentials);
      }
    } catch (error) {
      console.error('Failed to fetch credentials:', error);
    } finally {
      setIsLoadingCredentials(false);
    }
  }, [onFetchCredentials, dfspId]);

  // Fetch credentials when we know they exist
  useEffect(() => {
    if (credentialsExist && !credentials && !isLoadingCredentials) {
      loadCredentials();
    }
  }, [credentialsExist, credentials, isLoadingCredentials, loadCredentials]);

  // Disable input elements and add copy buttons via JavaScript
  useEffect(() => {
    const ICON_TRANSITION_TIMEOUT = 1500;
    const DOM_UPDATE_DELAY = 0;
    
    const CONFIG = {
      iconId: '#documents',
      successIconId: '#check-small'
    };
    
    const CSS_CLASSES = {
      credentialsDisplay: '.pm4ml-credentials__display',
      inputContent: '.mb-input__content',
      iconContainer: '.mb-input__inner-icon',
      copyButton: 'pm4ml-credentials__copy-button',
      copyIcon: 'pm4ml-credentials__copy-icon',
      copyIconSuccess: 'pm4ml-credentials__copy-icon--success',
      copyIconCopying: 'pm4ml-credentials__copy-icon--copying',
      existingIcon: 'el-icon control-icon__icon',
      iconContainerClasses: 'mb-input__inner-icon input-textfield__icon pm4ml-credentials__icon-container'
    };

    const updateCopyIcon = (svg, isSuccess = false, isCopying = false) => {
      svg.classList.remove(CSS_CLASSES.copyIconSuccess, CSS_CLASSES.copyIconCopying);
      
      if (isCopying) {
        svg.classList.add(CSS_CLASSES.copyIconCopying);
        svg.innerHTML = `<use xlink:href="${CONFIG.iconId}"></use>`;
      } else if (isSuccess) {
        svg.classList.add(CSS_CLASSES.copyIconSuccess);
        svg.innerHTML = `<use xlink:href="${CONFIG.successIconId}"></use>`;
      } else {
        svg.innerHTML = `<use xlink:href="${CONFIG.iconId}"></use>`;
      }
    };

    const copyToClipboard = async (text, field, copyButton) => {
      const svg = copyButton.querySelector('svg');
      
      try {
        // Show copying state
        updateCopyIcon(svg, false, true);
        
        await navigator.clipboard.writeText(text);
        
        // Show success state
        updateCopyIcon(svg, true, false);
        
        // Revert to normal state
        setTimeout(() => {
          updateCopyIcon(svg, false, false);
        }, ICON_TRANSITION_TIMEOUT);
        
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        // Revert to normal state on error
        updateCopyIcon(svg, false, false);
      }
    };

    const createCopyButton = (inputValue, fieldType) => {
      const copyButton = document.createElement('div');
      copyButton.className = CSS_CLASSES.copyButton;
      
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', `${CSS_CLASSES.existingIcon} ${CSS_CLASSES.copyIcon}`);
      svg.innerHTML = `<use xlink:href="${CONFIG.iconId}"></use>`;
      
      copyButton.appendChild(svg);
      copyButton.addEventListener('click', () => copyToClipboard(inputValue, fieldType, copyButton));
      
      return copyButton;
    };

    const ensureIconContainer = (inputContent) => {
      let iconContainer = inputContent.querySelector(CSS_CLASSES.iconContainer);
      
      if (!iconContainer) {
        iconContainer = document.createElement('div');
        iconContainer.className = CSS_CLASSES.iconContainerClasses;
        inputContent.appendChild(iconContainer);
      }
      
      return iconContainer;
    };

    const disableInputsAndAddCopyButtons = () => {
      const inputElements = document.querySelectorAll(`${CSS_CLASSES.credentialsDisplay} input`);
      
      inputElements.forEach((input) => {
        input.disabled = true;
        input.readOnly = true;
        
        const inputContent = input.closest(CSS_CLASSES.inputContent);
        if (!inputContent) return;
        
        const iconContainer = ensureIconContainer(inputContent);
        
        if (iconContainer && !iconContainer.querySelector(`.${CSS_CLASSES.copyButton}`)) {
          const fieldType = input.type === 'password' ? 'clientSecret' : 'clientId';
          const copyButton = createCopyButton(input.value, fieldType);
          iconContainer.appendChild(copyButton);
        }
      });
    };

    if (credentials) {
      setTimeout(disableInputsAndAddCopyButtons, DOM_UPDATE_DELAY);
    }
  }, [credentials]);

  // Generate new credentials
  const handleGenerateCredentials = async () => {
    try {
      const newCredentials = await onCreateCredentials(dfspId);
      if (newCredentials) {
        setCredentials(newCredentials);
      }
    } catch (error) {
      console.error('Failed to generate credentials:', error);
    }
  };

  // Regenerate credentials (same as generate)
  const handleRegenerateCredentials = async () => {
    await handleGenerateCredentials();
    setShowRegenerateModal(false);
  };



  const renderUIState = () => {
    // Loading state - show spinner during initial check or any pending operation
    if (isPending || (isInitialLoad && !error)) {
      return (
        <div className="pm4ml-credentials__loading">
          <Spinner size="m" />
          <span>{isInitialLoad ? 'Checking credentials...' : 'Processing credentials...'}</span>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <MessageBox
          kind="danger"
          message={`Error: ${error}`}
          size="s"
        />
      );
    }

    // No credentials state
    if (!credentialsExist) {
      return (
        <div className="pm4ml-credentials__no-credentials">
          <MessageBox
            kind="info"
            message="No PM4ML credentials have been generated for this DFSP yet."
            size="s"
          />
          <div className="pm4ml-credentials__actions">
            <Button
              label="Generate New Credentials"
              onClick={handleGenerateCredentials}
              disabled={isPending}
              kind="primary"
            />
          </div>
        </div>
      );
    }

    // Has credentials state
    if (credentialsExist) {
      // Show loading while fetching credential details
      if (isLoadingCredentials || (!credentials && !error)) {
        return (
          <div className="pm4ml-credentials__loading">
            <Spinner size="m" />
            <span>Loading credentials...</span>
          </div>
        );
      }

      return (
        <div>
          {credentials && (
            <div className="pm4ml-credentials__display">
              <div className="pm4ml-credentials__field-group">
                <label className="pm4ml-credentials__label">Client ID</label>
                <div>
                  <FormInput
                    type="text"
                    value={credentials.clientId}

                  />
                </div>
              </div>
              
              <div className="pm4ml-credentials__field-group">
                <label className="pm4ml-credentials__label">Client Secret</label>
                <div>
                  <FormInput
                    type="password"
                    value={credentials.clientSecret}
                  />
                </div>
              </div>

              <div className="pm4ml-credentials__metadata">
                <div className="pm4ml-credentials__info">
                  <label>Created:</label>
                  <span>{new Date(credentials.createdAt).toLocaleString()}</span>
                </div>
                {credentials.updatedAt && (
                  <div className="pm4ml-credentials__info">
                    <label>Last Updated:</label>
                    <span>{new Date(credentials.updatedAt).toLocaleString()}</span>
                  </div>
                )}
                <div className="pm4ml-credentials__info">
                  <label>DFSP:</label>
                  <span>{dfspName} ({dfspId})</span>
                </div>
              </div>


            </div>
          )}
          <div className="pm4ml-credentials__actions" style={{ marginTop: '16px' }}>
            <Button
              label="Regenerate Credentials"
              onClick={() => setShowRegenerateModal(true)}
              disabled={isPending || isLoadingCredentials}
              kind="danger"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  // Only render for application/DFSP users
  if (!isCurrentUserDfspUser) {
    return null;
  }

  return (
    <div className="pm4ml-credentials">
      <div className="pm4ml-credentials__header">
        <h2>PM4ML Keycloak Credentials</h2>
        <p>These credentials are used by PM4ML to authenticate with Keycloak for accessing MCM APIs.</p>
        <div className="pm4ml-credentials__warning">
          <MessageBox
            kind="warning"
            message="These credentials are sensitive and should be kept secure. Only share them with authorized personnel."
            size="s"
          />
        </div>
      </div>

      {renderUIState()}

      {showRegenerateModal && (
        <Modal
          title="Regenerate Credentials"
          onClose={() => setShowRegenerateModal(false)}
          allowSubmit
          isSubmitEnabled={!isPending && !isLoadingCredentials}
          onSubmit={handleRegenerateCredentials}
          submitLabel="Regenerate"
          submitKind="danger"
        >
          <div>
            <MessageBox
              kind="warning"
              message="Regenerating credentials will invalidate the current credentials. Make sure to update PM4ML configuration with the new credentials."
              size="s"
            />
            <p>Are you sure you want to regenerate the Keycloak credentials for {dfspName}?</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default connect(stateProps, actionProps)(PM4MLCredentials); 