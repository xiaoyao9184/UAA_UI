# UAA_UI

AngularJs UI client for CloudFoundry UAA

## Info

This project is Fork from an [old project](https://github.com/svennela/UAA_UI) create by svennela.

CloudFoundry UAA is not included manage page.

This project is another option for manage UAA by using [uaa-cli](https://github.com/cloudfoundry-incubator/uaa-cli) or [cf-uaac](https://github.com/cloudfoundry/cf-uaac).
 
And you can try other styles of UI, like https://github.com/making/uaa-ui

## Use

### for JAVA user

- run
    > mvn spring-boot:run
- access `http://localhost:8081`

### for NodeJS user

switch to `/src/main/webapp` directory.

- run
    > npm install
- run
    > npm run server
- access `http://localhost:3000`

## Development

Just switch to `/src/main/webapp` directory.
Use editor with static file HTTP server,
like VSCode with Live Server Plugin.

If you don't have a ready-made UAA service instance.
switch to `/development` run the following command in bash.

> ./run_quick-uaa-local.sh

it will use [quaa](https://github.com/starkandwayne/quaa) start a development UAA instance.

## Screen shots

Use password grant for login, you can change in 'Setting' use other OAuth2 flow to login.

![Alt text](/doc/login.png?raw=true "Login")

Very little information, But still provide basic functionality.

![Alt text](/doc/user-info.png?raw=true "UserInfo")

Navigation will include all features, even contains zone mode.

![Alt text](/doc/nav.png?raw=true "Nav")
![Alt text](/doc/zone-mode.png?raw=true "ZoneMode")

Creating a zone is not a good choice because of the many configurations.

![Alt text](/doc/zone.png?raw=true "Zone")

Synchronize login status with single sign-on.

![Alt text](/doc/sso.png?raw=true "SSO")

Upgrade the client to APP so that it can be show in UAA.
Or create new client.

![Alt text](/doc/app.png?raw=true "App")
![Alt text](/doc/client.png?raw=true "Client")

Login with other IdP is easy to integrate google or okta

![Alt text](/doc/idp.png?raw=true "IDP")

You can enable MFA, although only GoogleAuthenticator(totp) is currently supported.

![Alt text](/doc/mfa.png?raw=true "MFA")

No one will use SAML service at present.

![Alt text](/doc/saml.png?raw=true "SAML")

Exciting with [guess search](https://xiaoyao9184.wordpress.com/2019/03/25/think-about-guess-search/).

![Alt text](/doc/guess-search.gif?raw=true "GuessSearch")

![Alt text](/doc/guess_search_uaa_ui.gif "GuessSearch")
![Alt text](/doc/guess_search_uaa_ui_2.gif "GuessSearch")