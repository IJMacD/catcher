FROM node:22.2-slim AS game-build
WORKDIR /app
COPY game/package.json game/yarn.lock /app
RUN ["yarn"]
COPY game /app
RUN ["yarn", "build"]

FROM node:22.2-slim AS leaderboard-build
WORKDIR /app
COPY leaderboard/package.json leaderboard/yarn.lock /app
RUN ["yarn"]
COPY leaderboard /app
RUN ["yarn", "build"]

FROM node:22.2-slim AS final
WORKDIR /app
COPY server /app
RUN ["yarn", "--frozen-lockfile"]
COPY --from=game-build /app/dist /app/public
COPY --from=leaderboard-build /app/dist /app/public/leaderboard
CMD ["node", "."]