import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  readonly lastActivityKey = 'lastActivity';
  readonly sessionIdKey = 'sessionId';
  inactiveDuration: number = 30 * 60 * 1000;

  constructor(private keycloakService: KeycloakService) {}

  public initializeInactivityTimeout() {
    ['click', 'mousemove', 'keypress'].forEach(event => {
      window.addEventListener(event, this.resetInactivityTimeout);
    });
    setInterval(this.checkInactivityTimeout, this.inactiveDuration);
    this.resetInactivityTimeout();
  }

  private resetInactivityTimeout = () => {
    localStorage.setItem(this.lastActivityKey, Date.now().toString());
  };

  private checkInactivityTimeout = () => {
    const lastActivity = parseInt(localStorage.getItem(this.lastActivityKey) || '0', 10);
    if (Date.now() - lastActivity > this.inactiveDuration) {
      this.keycloakService.logout();
    }
  };

  public checkInactivitySession() {
    const sessionId = this.keycloakService.getKeycloakInstance().sessionId;
    const storedSessionId = localStorage.getItem(this.sessionIdKey);
    if (sessionId && storedSessionId && storedSessionId === sessionId) {
      this.checkInactivityTimeout();
    } else if (sessionId) {
      localStorage.setItem(this.sessionIdKey, sessionId);
      this.resetInactivityTimeout();
    }
  }
}
