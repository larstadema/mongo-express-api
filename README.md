# Express + MongoDB Api
Example repository for quickly starting development. Including are the following things:
- Logging with request-id tracing
- User system with sign-in and sign-up. Including argon2 hashing with salt and pepper (Do not lose the pepper config else all password will be invalidated!)

## Development
Make sure to use node `>10.17.0` as interally the AsyncLocalStorage module is used, included is a `.nvmrc` file with a usable node version.
```bash
$ nvm use
```

Start the application with `npm run serve`.

## Roadmap
- [x] Logging (winston + request-id)
- [x] API Request Validation (Celebrate+Joi)
- [x] Secure password hashing algorithm (argon2)
- [ ] Jobs with Agenda
- [ ] Basic mailing service (mailgun)

