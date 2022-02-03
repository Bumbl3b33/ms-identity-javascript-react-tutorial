import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { MicrosoftLoginAgent } from "../authConfig";

export const NavigationBar = () => {
  //const { instance } = useMsal();
  const handleMicrosoftSignOut = async () => {
    await MicrosoftLoginAgent.logout();
    const account = MicrosoftLoginAgent.getAccount();
    //setAccount(account);
    //window.location.replace("/");
  };
  const handleMicrosoftSignIn = async () => {
    await MicrosoftLoginAgent.login();
    const account = MicrosoftLoginAgent.getAccount();
    //setAccount({ ...MicrosoftLoginAgent.getAccount() });
  };

  /**
   * Most applications will need to conditionally render certain components based on whether a user is signed in or not.
   * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will
   * only render their children if a user is authenticated or unauthenticated, respectively.
   */
  return (
    <>
      <Navbar bg="primary" variant="dark">
        <a className="navbar-brand" href="/">
          Custom Sample Application
        </a>
        <AuthenticatedTemplate>
          <Nav.Link as={Button} href="/hello">
            My Profile
          </Nav.Link>
          <div className="ml-auto">
            <Button variant="info" onClick={handleMicrosoftSignOut}>
              Sign out
            </Button>
          </div>

          {/* <Button variant="info" onClick={() => instance.loginPopup(b2cPolicies.authorities.editProfile)} className="ml-auto">Edit Profile</Button> */}
          {/* <DropdownButton variant="warning" className="ml-auto" drop="left" title="Sign Out">
                            <Dropdown.Item as="button" onClick={() => instance.logoutPopup({ postLogoutRedirectUri: "/", mainWindowRedirectUri: "/" })}>Sign out using Popup</Dropdown.Item>
                            <Dropdown.Item as="button" onClick={() => instance.logoutRedirect({ postLogoutRedirectUri: "/" })}>Sign out using Redirect</Dropdown.Item>
                        </DropdownButton> */}
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <div className="ml-auto">
            <Button variant="info" onClick={handleMicrosoftSignIn}>
              Sign in
            </Button>
          </div>

          {/* <DropdownButton variant="secondary" className="ml-auto" drop="left" title="Sign In">
                        <Dropdown.Item as="button" onClick={() => instance.loginPopup(loginRequest)}>Sign in using Popup</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => instance.loginRedirect(loginRequest)}>Sign in using Redirect</Dropdown.Item>
                    </DropdownButton> */}
        </UnauthenticatedTemplate>
      </Navbar>
    </>
  );
};
