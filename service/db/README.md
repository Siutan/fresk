# Fresk Backend Service

This is the source code for the Fresk backend service, an extension of the Pocketbase service.

The service is built using Go. and has been extended to include the following features:

- [POST] /error - Handles error reporting
- [POST] /bundle - Handles bundle creation
- [POST] /sourcemap - Handles source map uploading

## Getting Started

To start the service, you need to have Go installed on your machine.

Once you have Go installed, you can start the service by running the following command:

```bash
go run main.go serve
```

This will start the service on port 8090.

Please visit http://localhost:8090 to create a Pocketbase admin account.

## Features

The service provides the following features:

- Error reporting
- Bundle creation
- Source map uploading
- Integration with Fresk web SDK