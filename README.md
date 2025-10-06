# 🚀 Ordering App - Microservices Architecture

A scalable microservices application built with **NestJS**, **MongoDB Replica Set**, and **RabbitMQ** for event-driven communication.

## 🏗️ Architecture Overview

This application consists of three microservices:

- **🛒 Orders Service** (`port 3000`) - Handles order creation and management
- **🔐 Auth Service** - Manages user authentication and authorization
- **💳 Billing Service** - Processes payments and billing operations

### Event-Driven Communication

Services communicate asynchronously through **RabbitMQ** using the AMQP protocol, ensuring loose coupling and high scalability.

### Data Layer

- **MongoDB Replica Set** with Primary, Secondary, and Arbiter nodes for high availability
- **Bitnami Secure Images** for enhanced security and automatic updates

## 🛠️ Technologies Stack

- **Framework**: NestJS (Node.js)
- **Database**: MongoDB with Replica Set
- **Message Broker**: RabbitMQ (AMQP)
- **Package Manager**: PNPM
- **Containerization**: Docker & Docker Compose
- **Language**: TypeScript
- **Database Images**: Bitnami Secure MongoDB

## 📋 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PNPM](https://pnpm.io/) package manager
- [Docker](https://www.docker.com/) and Docker Compose
- [Git](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd ordering-app

# Install dependencies
pnpm install

# Install RabbitMQ packages for microservices communication
pnpm add @nestjs/microservices amqplib amqp-connection-manager @types/amqplib
```

### 2. Start Infrastructure Services

```bash
# Start MongoDB Replica Set + RabbitMQ
docker-compose up -d mongodb-primary mongodb-secondary mongodb-arbiter rabbitmq
```

### 3. Start Development Server

```bash
# Start orders service with hot reload
docker-compose up orders

# Or start all services
docker-compose up
```

The orders service will be available at `http://localhost:3000`

## 🐳 Docker Development Setup

### Hot Reload Configuration

Our Docker setup provides **instant hot reload** without rebuilding containers:

```yaml
# docker-compose.yml
services:
  orders:
    build:
      context: .
      dockerfile: ./apps/orders/Dockerfile
      target: development # Multi-stage build for development
    command: npm run start:dev orders
    volumes:
      - .:/usr/src/app # Mount source code
      - /usr/src/app/node_modules # Preserve container's node_modules
    ports:
      - '3000:3000'
```

### How it works:

- ✅ **Real-time updates**: Changes in your local files are instantly reflected in the container
- ✅ **Preserved dependencies**: `node_modules` from container are protected from local conflicts
- ✅ **No rebuilds needed**: Only the Node.js process restarts, not the container
- ✅ **Cross-platform**: Works consistently on Windows, Mac, and Linux

## 🗄️ Database Configuration

### MongoDB Replica Set

The application uses a **3-node MongoDB replica set** for high availability:

- **Primary Node** (`mongodb-primary:27017`) - Handles writes
- **Secondary Node** (`mongodb-secondary:27017`) - Replication + reads
- **Arbiter Node** (`mongodb-arbiter:27017`) - Voting in elections

### Bitnami Secure Images

We use `bitnamisecure/mongodb:latest` for:

- 🛡️ **Enhanced Security**: Minimal attack surface with Photon Linux
- 🔄 **Automatic Updates**: Security patches applied within hours
- 📋 **Compliance**: Includes SBOMs, virus scans, and attestation signatures

## 📨 RabbitMQ Integration

### Package Installation

```bash
# Core RabbitMQ packages
pnpm add amqplib amqp-connection-manager @types/amqplib

# NestJS microservices (includes RabbitMQ integration)
pnpm add @nestjs/microservices
```

### Event Flow Example

```typescript
// 1. Orders service publishes event
@Post()
async createOrder(@Body() order: any) {
  const newOrder = await this.ordersService.createOrder(order);

  // Publish to RabbitMQ
  this.billingClient.emit('order_created', newOrder);

  return newOrder;
}

// 2. Billing service consumes event
@MessagePattern('order_created')
async handleOrderCreated(@Payload() orderData: any) {
  return await this.billingService.processPayment(orderData);
}
```

## 🔧 Available Scripts

```bash
# Development
pnpm run start:dev          # Start with watch mode
pnpm run start:dev orders   # Start specific service

# Production
pnpm run build              # Build all services
pnpm run start:prod         # Start production mode

# Testing
pnpm run test               # Unit tests
pnpm run test:e2e           # End-to-end tests
pnpm run test:cov           # Coverage report

# Linting
pnpm run lint               # ESLint
pnpm run format             # Prettier formatting
```

## 🐋 Docker Commands

```bash
# Start all services
docker-compose up

# Start specific services
docker-compose up orders mongodb-primary rabbitmq

# Background mode
docker-compose up -d

# View logs
docker-compose logs orders

# Rebuild containers
docker-compose build

# Stop all services
docker-compose down

# Clean up volumes
docker-compose down -v
```

## 📁 Project Structure

```
ordering-app/
├── apps/
│   ├── orders/           # Orders microservice
│   ├── auth/             # Authentication service
│   └── billing/          # Billing service
├── libs/
│   └── common/           # Shared libraries
│       ├── database/     # Database abstractions
│       └── rmq/          # RabbitMQ utilities
├── docker-compose.yml    # Container orchestration
└── README.md
```

## 🔧 Environment Configuration

### Required Environment Variables

Create `.env` files in each service directory:

```bash
# apps/orders/.env
DATABASE_URL=mongodb://mongodb-primary:27017/orders
RABBIT_MQ_URI=amqp://rabbitmq:5672
RABBIT_MQ_ORDERS_QUEUE=orders_queue
```

## 🚨 Troubleshooting

### MongoDB Connection Issues

```bash
# Check replica set status
docker exec -it ordering-app-mongodb-primary-1 mongosh --eval "rs.status()"
```

### RabbitMQ Management

```bash
# Access RabbitMQ Management UI (add to docker-compose if needed)
# http://localhost:15672
# Default: guest/guest
```

### TypeScript Compilation Errors

```bash
# Clear build cache
pnpm run build --force

# Check for type issues
pnpm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is [MIT licensed](LICENSE).

## 🆘 Support

- 📖 [NestJS Documentation](https://docs.nestjs.com)
- 🐰 [RabbitMQ Tutorials](https://www.rabbitmq.com/tutorials)
- 🍃 [MongoDB Replica Sets](https://docs.mongodb.com/manual/replication/)
- 🐳 [Docker Compose Reference](https://docs.docker.com/compose/)

---

Built with ❤️ using NestJS and modern microservices architecture.
