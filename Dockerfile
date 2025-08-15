# Stage 1: Builder (frontend + backend)
FROM node:18-alpine AS builder
WORKDIR /app

# pnpm via corepack
RUN corepack enable

# Workspace root files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Workspace manifests (for filtered install)
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

# Install all deps (cached by lockfile)
RUN pnpm install --frozen-lockfile

# Copy sources
COPY backend backend
COPY frontend frontend

# Build frontend and backend
RUN pnpm --filter kma-wol-frontend build
RUN pnpm --filter kma-wol-backend build


# Stage 2: Runtime (production)
FROM node:18-alpine
WORKDIR /app

# pnpm via corepack
RUN corepack enable

# Prepare production deps for backend only
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json backend/package.json
RUN pnpm install --prod --frozen-lockfile --filter kma-wol-backend

# Copy built artifacts
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/frontend/dist ./frontend/dist

# Port (configurable via PORT env; default 3000)
EXPOSE 3000

# Ensure backend resolves public dir correctly
ENV NODE_CWD=/app/backend

CMD ["node", "backend/dist/src/server.js"]
