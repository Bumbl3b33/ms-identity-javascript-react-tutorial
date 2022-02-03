/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as msal from "@azure/msal-browser";
import { LogLevel } from "@azure/msal-browser";

/**
 * Enter here the user flows and custom policies for your B2C application
 * To learn more about user flows, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies = {
  names: {
    signUpSignIn: "b2c_1_susi",
  },
  authorities: {
    signUpSignIn: {
      authority:
        "https://matrimonydevadb2c.b2clogin.com/matrimonydevadb2c.onmicrosoft.com/b2c_1_susi",
    },
  },
  authorityDomain: "matrimonydevadb2c.b2clogin.com",
};

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig = {
  auth: {
    clientId: "6acb4d16-aaee-4436-8863-88ffb0133963", // This is the ONLY mandatory field that you need to supply.
    authority: b2cPolicies.authorities.signUpSignIn.authority, // Choose SUSI as your default authority.
    knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
    redirectUri: "/", // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
    postLogoutRedirectUri: "/", // Indicates the page to navigate after logout.
    navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
  },
  cache: {
    cacheLocation: "sessionStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const protectedResources = {
  apiHello: {
    endpoint: "http://localhost:5000/hello",
    scopes: [
      "https://matrimonydevadb2c.onmicrosoft.com/eec3643d-92c1-400b-8f5f-3f276742f101/profile.view",
    ], // e.g. api://xxxxxx/access_as_user
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: [...protectedResources.apiHello.scopes],
};

class MicrosoftLoginAgent {
  constructor() {
    this.username = "";
    this.account = "";
    this.msalInstance = this.init();
  }

  init() {
    try {
      return new msal.PublicClientApplication(msalConfig);
    } catch (ex) {
      console.log("Login Failure");
    }
  }

  async login() {
    console.log("Logging Out");

    await this.msalInstance.loginPopup(loginRequest);

    // try {
    //   const request = {
    //     scopes: process.env.REACT_APP_SCOPES.split(","),
    //     prompt: "select_account",
    //   };
    //   const response = await this.msalInstance.loginPopup(request);
    //   this.msalInstance.setActiveAccount(response.account);
    // } catch (ex) {}
  }

  async logout() {
    console.log("Logging Out");

    await this.msalInstance.logoutPopup({
      postLogoutRedirectUri: "/",
      mainWindowRedirectUri: "/",
    });

    //this.msalInstance.logoutPopup();
  }

  async getAccessToken() {
    console.log("Getting Access Token");

    // const request = {
    //   scopes: process.env.REACT_APP_SCOPES.split(","),
    //   account: {},
    // };

    try {
      const { accessToken } = await this.msalInstance.acquireTokenSilent(
        loginRequest
      );
      console.log(accessToken);
      return accessToken;
    } catch (ex) {
      if (ex.name === "BrowserAuthError") {
        try {
          const response = await this.msalInstance.acquireTokenPopup(request);
          window.location.reload();
          return response.accessToken;
        } catch (ex) {}
      }
    }
  }

  getAccount() {
    console.log("Getting Account");

    console.log(this.msalInstance.getAllAccounts()[0]);
    return this.msalInstance.getAllAccounts()[0];
  }
}

const microsoftLoginAgent = new MicrosoftLoginAgent();

export { microsoftLoginAgent as MicrosoftLoginAgent };
