class SessionHandler {
  sessionTitle = 'user';

  getSessionUser() {
    return sessionStorage.getItem(sessionTitle);
  }

  setSessionUser(user) {
    sessionStorage.setItem(sessionTitle, user);
  }

  removeSessionUser() {
    sessionStorage.removeItem(sessionTitle);
  }
}

module.exports = SessionHandler;
