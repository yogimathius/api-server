# AI Engines API Server

Production-ready API server for the AI Engines Platform, featuring AgentOps and Sacred Codex functionality.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL 15.x
- Redis 7.x (optional, for caching)

### Development Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd api-server
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001` with documentation at `http://localhost:3001/docs`.

## 🐳 Docker Deployment

### Single Container
```bash
npm run docker:build
npm run docker:run
```

### Full Stack with Docker Compose
```bash
npm run docker:compose
```

This starts:
- API server (port 3001)
- PostgreSQL database (port 5432)
- Redis cache (port 6379)
- Nginx reverse proxy (ports 80/443)

## 📊 Health Checks

- **Basic Health**: `GET /health`
- **Detailed Health**: `GET /health/detailed`
- **Liveness Probe**: `GET /health/live` (for Kubernetes)
- **Readiness Probe**: `GET /health/ready` (for Kubernetes)

## 🔧 Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run start:prod` - Start with production environment

### Testing & Quality
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run typecheck` - Check TypeScript types
- `npm run format` - Format code with Prettier
- `npm run security:audit` - Run security audit

### Database
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

### Docker
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container
- `npm run docker:compose` - Start with Docker Compose
- `npm run docker:compose:down` - Stop Docker Compose

## 🔒 Security Features

- **Rate Limiting**: Configurable per-endpoint rate limits
- **Security Headers**: Comprehensive security headers via Helmet
- **Input Validation**: Zod schema validation for all inputs
- **JWT Authentication**: Secure token-based authentication
- **CORS**: Configurable cross-origin resource sharing
- **Request Size Limits**: Prevents large payload attacks

## 📈 Monitoring & Observability

- **Structured Logging**: JSON logs with Pino
- **Error Tracking**: Ready for Sentry integration
- **Health Checks**: Comprehensive health monitoring
- **Performance Metrics**: Request timing and performance data

## 🏗️ Architecture

```
src/
├── config/           # Configuration and environment
├── middleware/       # Custom middleware
├── routes/          # API route handlers
├── services/        # Business logic services
├── types/           # TypeScript type definitions
└── server.ts        # Application entry point
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Server port | `3001` | No |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | - | Yes |
| `REDIS_URL` | Redis connection string | - | No |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | - | No |
| `API_RATE_LIMIT` | Requests per window | `100` | No |
| `API_RATE_WINDOW` | Rate limit window (minutes) | `15` | No |
| `LOG_LEVEL` | Logging level | `info` | No |

### Production Configuration

For production deployment, copy `.env.production` to `.env` and update:

- Set strong `JWT_SECRET` (min 32 characters)
- Configure production `DATABASE_URL`
- Set appropriate `CORS_ORIGINS`
- Configure monitoring (`SENTRY_DSN`)
- Set up Redis for caching (`REDIS_URL`)

## 🚀 Deployment

### Docker Compose (Recommended)
```bash
# Production deployment
docker-compose -f docker-compose.yml up -d
```

### Kubernetes
```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/
```

### Traditional Server
```bash
# Build and start
npm run build
npm run start:prod
```

## 📝 API Documentation

Interactive API documentation is available at `/docs` when the server is running.

### Key Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/agents` - List AI agents
- `POST /api/tasks` - Create new task
- `GET /api/projects` - List projects
- `GET /api/codex` - Sacred Codex endpoints

## 🔍 Monitoring

### Health Monitoring
```bash
# Check if server is healthy
curl http://localhost:3001/health

# Detailed health check
curl http://localhost:3001/health/detailed
```

### Logs
```bash
# View logs in Docker
docker-compose logs -f api

# View logs with JSON formatting
npm run dev | npx pino-pretty
```

## 🛠️ Development

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Conventional commits

### Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Database
```bash
# Generate Prisma client
npm run db:generate

# Create migration
npx prisma migrate dev --name migration-name

# View database
npm run db:studio
```

## 📋 Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Monitoring and logging configured
- [ ] Rate limiting configured
- [ ] Security headers enabled
- [ ] Health checks passing
- [ ] Backup strategy implemented
- [ ] CI/CD pipeline configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linting and tests
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details