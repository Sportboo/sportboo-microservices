# Sportboo Microservices

This project is a monorepo containing several NestJS microservices for a sports betting platform.

## Project Overview

*   **Framework:** NestJS
*   **Language:** TypeScript
*   **Architecture:** Microservices
*   **Communication:** The services appear to use a combination of REST APIs and message queues (likely RabbitMQ, given the `amqp-connection-manager` and `amqplib` dependencies) for communication.
*   **Workspaces:** The project is organized as a monorepo with applications in the `apps` directory and shared libraries in the `libs` directory.

### Services

The following microservices are included in this project:

*   `chat-service`
*   `file-storage-service`
*   `iam-service` (Identity and Access Management)
*   `notification-service`
*   `p2p-betting-service` (Peer-to-Peer Betting)
*   `sports-data-service`
*   `sports-sync-service`
*   `user-service`
*   `wallet-service`

### Libraries

The following shared libraries are included in this project:

*   `common`: Common utilities and modules.
*   `database`: Database-related modules and services.
*   `testing`: Testing utilities and configurations.

## Building and Running

### Installation

```bash
yarn install
```

### Running the Services

To run a specific service, you can use the `nest start` command with the service name as the argument.

```bash
# Start a specific service in development mode
yarn start:dev <service-name>

# Example:
yarn start:dev iam-service
```

### Building the Services

To build a specific service, you can use the `nest build` command with the service name as the argument.

```bash
# Build a specific service
yarn build <service-name>

# Example:
yarn build iam-service
```

## Testing

To run the tests for the entire project, use the following command:

```bash
yarn test
```

To run the tests for a specific service, you can use the `--config` flag to specify the Jest configuration file for that service.

```bash
# Run e2e tests for a specific service
yarn test:e2e --config ./apps/<service-name>/test/jest-e2e.json

# Example:
yarn test:e2e --config ./apps/iam-service/test/jest-e2e.json
```
