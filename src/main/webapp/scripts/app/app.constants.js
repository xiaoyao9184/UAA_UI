"use strict";
// EDIT THIS FILE IS ONLY FOR DEVELOPMENT ENVIRONMENT, PLEASE EDIT config.json FOR PRODUCTION ENVIRONMENT
angular.module('uaaUIApp')

.constant('ENV', 'dev')

.constant('VERSION', '0.0.1-SNAPSHOT')

.constant('STATHAT', {
    bootstrap: "RencrlZ-Y676klqbg6zAmSAyc0Vh",
    icu: ""
})

.constant('GROUPS', [
    "zones.read",
    "zones.write",
    "idps.read",
    "idps.write",
    "clients.admin",
    "clients.write",
    "clients.read",
    "clients.secret",
    "scim.write",
    "scim.read",
    "scim.create",
    "scim.userids",
    "scim.zones",
    "scim.invite",
    "password.write",
    "oauth.approval",
    "oauth.login", 
    "approvals.me", 
    "openid", 
    "groups.update",
    "uaa.user",
    "uaa.resource",
    "uaa.admin"
])

.constant('GRANTS', [
    {
        "name": "client_credentials",
        "type": "oauth2",
        "token": true,
        "grant": true
    },
    {
        "name": "implicit",
        "type": "oauth2",
        "token": true,
        "grant": true
    },
    {
        "name": "password",
        "type": "oauth2",
        "token": true,
        "grant": true
    },
    {
        "name": "authorization_code",
        "type": "oauth2",
        "token": true,
        "grant": true
    },
    {
        "name": "auto_login",
        "type": "oauth2",
        "token": true,
        "grant": false
    },
    {
        "name": "passcode",
        "type": "oauth2",
        "token": true,
        "grant": false
    },
    {
        "name": "refresh_token",
        "type": "flag",
        "grant": true
    },
    {
        "name": "user_token",
        "type": "other",
        "grant": true
    },
    {
        "name": "saml2-bearer",
        "type": "other",
        "value": "urn:ietf:params:oauth:grant-type:saml2-bearer",
        "grant": true
    },
    {
        "name": "jwt-bearer",
        "type": "other",
        "value": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "grant": true
    }
])

.constant('SETTING', {
    "version": 8,
    "debug": true,

    "url": "http://localhost:8080/uaa/",
    "clientId": "uaa_ui",
    "username": "admin",
    "loginType": "password",

    "authUrlPath": "oauth/authorize",
    "authRedirectUrl": "#/auth_redirect?",

    "authWindowType": "popup",
    "authWindowParam" :"toolbar=no,scrollbars=no,resizable=no,top=100,left=500,width=600,height=800",

    "sessionCheckUrl": "session_management"
    
    // dev
    ,
    "clientSecret": "x9nkg9n7bnberzekf3ni",
    "password": 'nzhpjprxkcojt1dols89',
})
;