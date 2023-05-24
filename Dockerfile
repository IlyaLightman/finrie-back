FROM mhart/alpine-node:latest

ARG NODE_ENV=production

RUN apk add --no-cache postgresql-client

ENV NODE_ENV ${NODE_ENV}
ENV DATABASE_URL postgresql://postgres:pass@database:5432/postgres?connect_timeout=300&schema=finrie

COPY ./build /build
COPY ./prisma /prisma
COPY ./package.json /package.json
COPY ./package-lock.json /package-lock.json

RUN NODE_ENV=$NODE_ENV npm ci --only=production

HEALTHCHECK --interval=10s --timeout=5s \
  CMD pg_isready -U postgres

CMD sh -c 'until pg_isready -U postgres -h database; do sleep 1; done && npx prisma generate && npx prisma migrate deploy && node build/app.js'

EXPOSE 5000
