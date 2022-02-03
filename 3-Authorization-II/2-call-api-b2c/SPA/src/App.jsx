/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { MsalProvider, useMsal } from "@azure/msal-react";
import { EventType, InteractionType } from "@azure/msal-browser";

import { b2cPolicies, MicrosoftLoginAgent } from "./authConfig";
import { PageLayout } from "./components/PageLayout";
import { Hello } from "./pages/Hello";

import "./styles/App.css";

const Pages = () => {
  /**
   * useMsal is hook that returns the PublicClientApplication instance,
   * an array of all accounts currently signed in and an inProgress value
   * that tells you what msal is currently doing. For more, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
   */

  /**
   * Using the event API, you can register an event callback that will do something when an event is emitted.
   * When registering an event callback in a react component you will need to make sure you do 2 things.
   * 1) The callback is registered only once
   * 2) The callback is unregistered before the component unmounts.
   * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/events.md
   */
  useEffect(() => {
    const callbackId = MicrosoftLoginAgent.msalInstance.addEventCallback(
      (event) => {
        if (event.eventType === EventType.LOGIN_FAILURE) {
          if (
            event.error &&
            event.error.errorMessage.indexOf("AADB2C90118") > -1
          ) {
            if (event.interactionType === InteractionType.Redirect) {
              MicrosoftLoginAgent.msalInstance.loginRedirect(
                b2cPolicies.authorities.forgotPassword
              );
            } else if (event.interactionType === InteractionType.Popup) {
              MicrosoftLoginAgent.msalInstance
                .loginPopup(b2cPolicies.authorities.forgotPassword)
                .catch((e) => {
                  return;
                });
            }
          }
        }

        if (
          event.eventType === EventType.LOGIN_SUCCESS ||
          event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
        ) {
          //successfully logged in

          console.log(event.payload);
        }
      }
    );

    return () => {
      if (callbackId) {
        MicrosoftLoginAgent.msalInstance.removeEventCallback(callbackId);
      }
    };
  }, []);

  return (
    <Switch>
      <Route path="/hello">
        <Hello />
      </Route>
    </Switch>
  );
};

const App = () => {
  return (
    <Router>
      <MsalProvider instance={MicrosoftLoginAgent.msalInstance}>
        <PageLayout>
          <Pages />
        </PageLayout>
      </MsalProvider>
    </Router>
  );
};

export default App;
