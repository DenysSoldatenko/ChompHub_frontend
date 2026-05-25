import {useState, useEffect} from 'react';

const ErrorDisplay = ({message, onDismiss}) => {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (<div className="error-display" role="alert" aria-live="assertive">
        <div className="error-content">
          <span className="error-message">{message}</span>
          <div className="error-progress"></div>
        </div>
      </div>);
};

export const useError = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  const showError = (message) => setErrorMessage(message);
  const dismissError = () => setErrorMessage(null);

  return {
    errorMessage, showError, dismissError, RenderError: <ErrorDisplay message={errorMessage} onDismiss={dismissError}/>
  };
};