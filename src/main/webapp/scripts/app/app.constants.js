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

//Use for add group
.constant('ZONE_SCOPES', [
    { "template": "zones.<zone id>.admin", "description": "scope that permits operations in a designated zone by authenticating against the default zone, such as create identity providers or clients in another zone (used together with the X-Identity-Zone-Id header)" },
    { "template": "zones.<zone id>.read", "description": "scope that permits reading the given identity zone (used together with the X-Identity-Zone-Id header)" },
    { "template": "zones.<zone id>.clients.admin", "description": "translates into clients.admin after zone switch is complete (used together with the X-Identity-Zone-Id header)" },
    { "template": "zones.<zone id>.clients.read", "description": "translates into clients.read after zone switch is complete (used together with the X-Identity-Zone-Id header)" },
    { "template": "zones.<zone id>.clients.write", "description": "translates into clients.write after zone switch is complete (used together with the X-Identity-Zone-Id header)" },
    { "template": "zones.<zone id>.scim.read", "description": "translates into scim.read after zone switch is complete (used together with the X-Identity-Zone-Id header)" },
    { "template": "zones.<zone id>.scim.create", "description": "translates into scim.create after zone switch is complete (used together with the X-Identity-Zone-Id header)" },
    { "template": "zones.<zone id>.scim.write", "description": "translates into scim.write after zone switch is complete (used together with the X-Identity-Zone-Id header)" },
    { "template": "zones.<zone id>.idps.read", "description": "translates into idps.read after zone switch is complete (used together with the X-Identity-Zone-Id header)" }
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

    "sessionCheckUrl": "session_management",
    
    // dev
    
    "clientSecret": "x9nkg9n7bnberzekf3ni",
    "password": 'nzhpjprxkcojt1dols89',
})
;