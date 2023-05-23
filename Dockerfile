FROM mhart/alpine-node:latest

ARG NODE_ENV=production

ENV NODE_ENV ${NODE_ENV}
ENV CORS_HOSTNAME localhost
ENV DATABASE_URL postgresql://postgres:pass@localhost:5432/postgres?schema=finrie
ENV SECRET supersecret

COPY ./build /build
COPY ./prisma /prisma
COPY ./package.json /package.json
COPY ./package-lock.json /package-lock.json

RUN NODE_ENV=$NODE_ENV npm install
RUN npx prisma generate
CMD ["node", "build/app.js"]
