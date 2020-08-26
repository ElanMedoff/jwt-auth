# JWT-Experiment

A mini-app using JWT authentication, approach outlined here: https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/#refresh_token

Uses JWT access tokens stored in React state, with refresh tokens stored in same-site, http cookies to refresh the access token on-reload, or whenever the refresh token may be valid but the access token is not.

The only session-like behavior on the server is a database of current refresh tokens. 

(A good excuse to try useState + useContext for global state, scss tricks, include-media, and client-side authentication)

Scenarios:
1. User logs in with correct credentials:
    * Granted an access token (short duration) and a refresh token (long duration) from the backend
1. User reloads the page while the refresh token is still valid
    * On load, React makes a call to the backend to ask for a new access token. If the refresh token is still valid, the token is verified, the user extracted, and an access token with the same user is encoded. The access token is returned to the user.
1. User has been inactive for longer than the duration of the access token, but shorter than the duration of the refresh token.
    * Before making any call, the access token stored in react state is decoded (NOT verified), and if the expiration date has passed, the client manually makes a call to the backend to get a new access token (see 2).
1. User has been inactive for longer than the duration of the refresh token:
    * Nothing to do here, the user must log in again.
1. User makes a call with a valid refresh token, but no access token:
    * The user is attacking with a CSRF attack. The authorization middleware expects an access token passed in as a header, and so the call will be rejected. 
1. User makes a call, but the access token and refresh token, when verified, point to different users:
    * The user is attacking with a CSRF attack, using his own access token and the refresh token of another user. The authorization middleware expects the two, when verified, to point to the same user, and so the call will be rejected.
 

