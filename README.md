# Express + MongoDB Api
Example repository for quickly starting development. Including are the following things:
- Logging with request-id tracing
- Full account system.
- User sessions with JWT secured by RSA private keys
- Keystore for handling refresh tokens and jwt blacklisting
- Route protection with user roles

## Available routes
https://documenter.getpostman.com/view/8836454/T17FB8v7?version=latest

- Accounts
  - /delete
  - /forgot-password
  - / (get all users as admin)
  - /:id (get user profile of yourself or others when admin)
  - /login
  - /logout
  - /refresh-token
  - /register
  - /reset-password
  - /revoke-token
  - /verify-email

## Development
### Node version
Make sure to use node `>10.17.0` as interally the AsyncLocalStorage module is used, included is a `.nvmrc` file with a usable node version.
```console
$ nvm use
```

### Environment settings
Create a `.env` file by copying over `.env.sample` and filling in your own values.
```console
$ cp .env.sample .env
```
Make sure to keep the default jwt token duration as low as possible and use the refresh token to generate new ones. ( recommended is jwt expiration every 15 minutes and refresh tokens expiration every 7 days)

### JWT RSA Keys
Create your own private rsa keys or copy over the example for a quick start in development. (**NOTE: Do not use the example keys in production!**)
Instructions: [keys readme](keys/readme.md)


Start the application with `npm run serve`.


## Roadmap
- [x] Logging (winston + request-id)
- [x] API Request Validation (Celebrate+Joi)
- [x] Secure password hashing algorithm (bcrypt)
- [x] Secure usage and handling of JWT tokens
- [x] Setup Redis for handling rate limiting
- [x] Prevent brute-force attacks against authorization [node-rate-limiter-flexible](https://github.com/animir/node-rate-limiter-flexible/wiki/Overall-example#login-endpoint-protection)
- [ ] Jobs with [Agenda](https://github.com/agenda/agenda)
- [ ] Basic mailing service (mailgun)
- [ ] Protected health endpoint with data like service info, [git info](https://www.npmjs.com/package/git-repo-info), process info etc. Extra inspiration: [server-health](https://github.com/AugustHome/server-health/blob/master/lib/health.js)
- [x] Docker setup
- [ ] Swagger docs
- [ ] Tests
- [ ] 2FA with [otplib](https://github.com/yeojz/otplib)