# Catcher

This is a catch game web application demonstrating various technologies. The
frontend is built with [React.JS](https://react.dev) and a backend is provided
using [Node.js](https://nodejs.org).

The leaderboard updates live to show the latest changes in standings, making use
of WebSockets to achieve this.

## Demo

A live version of the game can be accessed at https://catcher.ijmacd.com.

A static version (without leaderboard) is available at https://ijmacd.github.io/catcher.

## Project Structure

The project is divided into sub-projects focusing on different areas of concern. There are two seperate webapps and one server.
The main game code is located in the `game` directory, while the `leaderboard`
directory holds the code related to displaying the leaderboard.

There is a simple server implementing the leaderboard API and it is located in
the `server` directory.

## Local Development

To start developing the game locally follow the steps below in a terminal.

```console
$ git clone https://github.com/IJMacD/catcher.git
Cloning into catcher...
$ cd catcher/game
$ yarn
Installing dependencies...
$ yarn dev
Re-optimizing dependencies because lockfile has changed

  VITE v5.4.2  ready in 1073 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

To enable the server keeping track of the leaderboard, run these commands in a
sperate terminal:

```console
$ cd catcher
$ node server
Server running at http://0.0.0.0:3000
```

## API Specification

Full API docs are provided in the `docs` directory in the
[OpenAPI Sepcification](https://swagger.io/specification/) format. They are browsable at this link: https://ijmacd.github.io/catcher/docs

### `GET /api/leaderboard`
Gets a full listing of the top 100 entries on the leaderboard

A WebSocket connection to this endpoint will recieve updates in JSON format any time a new entry is added.

### `POST /api/leaderboard`
```
name=Bob&score=100
```
With a `application/x-www-urlencoded` body, this request inserts a new entry into the leaderboard.

### `GET /api/leaderboard/{id}`

Retrieves a single entry from the leaderboard

### `DELETE /api/leaderboard/{id}`

Deletes a single entry from the leaderboard. For moderation purposes entries can be removed via this endpoint.

HTTP Basic auth is required for this endpoint. The server is configured to accept a username of `moderator` and password provided in the `MODERATOR_PASSWORD` environment variable. If the env var is not set then the server will generate one by itself and log it to the console.

## Deployment

### Quick Deployment (Docker)

The quickest deployment method is using docker. The command below will start up a server on port 3000 using the moderator password provided.

```bash
docker run -it --init --rm -e MODERATOR_PASSWORD=secret -p 3000:3000 ijmacd/catcher:latest
```

### Bare server

To build the webapps go into each directory and run:

```bash
yarn build
```

This will produce a bundle in the `dist` subdirectories inside each webapp directory. These can then be deployed along with the code in the `server` directory.

### Docker

To build your own Docker image, execute the following command:

```bash
docker build -t catcher .
```

The image can then be run as demonstated above.

```bash
docker run -it --init --rm -e MODERATOR_PASSWORD=secret -p 3000:3000 catcher
```

### Kubernetes (Helm)

A Helm chart is also provided for easy deployment to a Kubernetes cluster.

```bash
helm upgrade --install catcher \
  ./kube/chart/catcher/ \
  --namespace catcher --create-namespace \
  --set web.ingress.hostname=catcher.example.com \
  --set web.secrets.moderatorPassword=secret
```

## Ideas for Improvement

### Game Play

* Add background audio and sound effects
* Improve collision detection to improve catching accuracy
* Limit the speed the player can sail at in order to increase difficulty
