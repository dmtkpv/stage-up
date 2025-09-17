ARG WORK_DIR=/app
ARG PNPM_DIR=/root/pnpm



# ---------------------
# Base
# ---------------------

FROM node:22-alpine AS base
ARG WORK_DIR
ARG PNPM_DIR

RUN corepack enable && corepack prepare pnpm@10.14 --activate
RUN pnpm config set store-dir ${PNPM_DIR} --global

WORKDIR ${WORK_DIR}



# ---------------------
# Production
# ---------------------

FROM base AS prod

COPY package.json pnpm-*.yaml ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/shared/package.json ./packages/shared/
COPY patches/ ./patches/
RUN pnpm install

COPY . .

CMD ["sh", "-c", "\
    pnpm frontend build && \
    pnpm backend script sitemap ../frontend/dist && \
    pnpm start \
"]
