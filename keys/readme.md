## Generate your own secure RSA keys
Naming should be `private_key.pem` and `public_key.pem`

Example of how you can generate those:
```console
foo@bar:~$ openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048

foo@bar:~$ openssl rsa -pubout -in private_key.pem -out public_key.pem
```