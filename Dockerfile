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

FROM golang:1.23 AS go-build
WORKDIR /go/src

COPY server/go.mod server/go.sum ./
RUN go mod download && go mod verify

COPY server/go ./go
COPY server/main.go .

ENV CGO_ENABLED=0
RUN go build -a -installsuffix cgo -o catcher .

FROM scratch AS runtime
COPY --from=go-build /go/src/catcher ./
COPY --from=game-build /app/dist ./public
COPY --from=leaderboard-build /app/dist ./public/leaderboard
EXPOSE 8080/tcp
ENTRYPOINT ["./catcher"]
