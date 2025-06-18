const getConfig = async () => {
  const { REACT_APP_API_BASE_URL, REACT_APP_CONFIG_PORT } = process.env;
  const { protocol, hostname } = window.location;

  // Configure the config server URL
  const configPort = REACT_APP_CONFIG_PORT || '3004';
  const configUrl = `${protocol}//${hostname}:${configPort}/config`;

  // Using the same protocol as we've been loaded from to avoid Mixed Content error.
  let apiBaseUrl = REACT_APP_API_BASE_URL ? REACT_APP_API_BASE_URL : `${protocol}//localhost:3001`;
  let isAuthEnabled = true;
  let checkSession;
  let loginUrl;
  let loginProvider;
  let logoutUrl;
  const infos = [`fetching config from ${configUrl}`];

  try {
    const response = await fetch(configUrl);
    const {
      AUTH_ENABLED,
      API_BASE_URL,
      CHECK_SESSION_URL,
      LOGIN_URL,
      LOGIN_PROVIDER,
      LOGOUT_URL,
    } = await response.json();

    isAuthEnabled = AUTH_ENABLED ? AUTH_ENABLED !== 'FALSE' : isAuthEnabled;
    apiBaseUrl = API_BASE_URL ? API_BASE_URL : apiBaseUrl;
    checkSession = CHECK_SESSION_URL;
    loginUrl = LOGIN_URL;
    logoutUrl = LOGOUT_URL;
    loginProvider = LOGIN_PROVIDER;

    infos.push({ AUTH_ENABLED, API_BASE_URL });
    infos.push(`- after processing config, apiBaseUrl: ${apiBaseUrl}`);
  } catch (err) {
    infos.push('returned error:');
    infos.push(err);
    infos.push(`- calling boot() without loading config.`);
  }

  console.info(...infos);

  return { apiBaseUrl, isAuthEnabled, checkSession, loginUrl, loginProvider, logoutUrl };
};

export default getConfig;
