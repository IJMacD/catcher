# Catcher

This is a catch game web application demonstrating various technologies. The
frontend is built with [React.JS](https://react.dev) and a backend is provided
using [Node.js](https://nodejs.org).

The leaderboard updates live to show the latest changes in standings, making use
of WebSockets to achieve this.

## Demo

A live version of the game can be accessed at https://catcher.ijmacd.com.

A static version (without leaderboard) is available at
https://ijmacd.github.io/catcher.

## Project Structure

The project is divided into sub-projects focusing on different areas of concern.
There are two seperate webapps and one server.

1. The main game code is located in the `game` directory
2. The `leaderboard` directory holds the code related to displaying the
leaderboard.
3. There is a simple server implementing the leaderboard API and it is located
in the `server` directory.

## Local Development

To start developing the game locally follow the steps below in a terminal.

```console
$ git clone https://github.com/IJMacD/catcher.git
Cloning into 'catcher'...
remote: Enumerating objects: 80, done.
remote: Counting objects: 100% (80/80), done.
remote: Compressing objects: 100% (66/66), done.
remote: Total 80 (delta 8), reused 79 (delta 7), pack-reused 0 (from 0)
Receiving objects: 100% (80/80), 3.18 MiB | 427.00 KiB/s, done.
Resolving deltas: 100% (8/8), done.
$ cd catcher/game
$ yarn
yarn install v1.22.19
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
[4/4] Building fresh packages...
Done in 3.02s.
$ yarn dev
yarn run v1.22.19
$ vite

  VITE v5.4.2  ready in 228 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

You will now be able to access a hot-reloading development version at
http://localhost:5173/.

To start the server keeping track of the leaderboard, run these commands in a
separate terminal:

```console
$ cd catcher/server
$ yarn
$ node .
Server running at http://0.0.0.0:3000
```

To complete the trilogy, the leaderboard dev server can be started too, in yet
another terminal:

```bash
cd catcher/leaderboard
yarn
yarn dev
```

The leaderboard will be accessible on a slightly different port if the game is
running at the same time: http://localhost:5174/.

All three components can communicate with each other in development without any
CORS issues.

## API Specification

Full API docs are provided in the `docs` directory in the
[OpenAPI Specification](https://swagger.io/specification/) format. They are
browsable at this link: https://ijmacd.github.io/catcher/docs

### `GET /api/leaderboard`
Gets a full listing of the top 100 entries on the leaderboard

A WebSocket connection to this endpoint will receive updates in JSON format any
time a new entry is added.

### `POST /api/leaderboard`
```
Content-Type: application/x-www-urlencoded

name=Bob&score=100
```
```
Content-Type: application/json

{"name":"bob","score":100}
```
These requests insert new entries into the leaderboard.

### `GET /api/leaderboard/{id}`

Retrieves a single entry from the leaderboard

### `DELETE /api/leaderboard/{id}`

Deletes a single entry from the leaderboard. Entries can be removed via this
endpoint for moderation purposes.

To delete entries, HTTP Basic auth is required. The server is configured to
accept a username of `moderator` and password provided in the
`MODERATOR_PASSWORD` environment variable. If the env var is not set then the
server will generate one by itself and log it to the console.

## Deployment

### Quick Deployment (Docker)

The quickest deployment method is using Docker. The command below will start up
a server on port 3000 using the moderator password provided.

```bash
docker run -it --init --rm -e MODERATOR_PASSWORD=secret -p 3000:3000 ijmacd/catcher:latest
```

### Bare server

To build the webapps go into each directory and build. For example run something
along the lines of the code below:

```bash
for i in game leaderboard; do
  (
    cd $i
    yarn
    yarn build
  )
done
```

This will produce a bundle in the `dist` subdirectories inside each webapp
directory. These can then be deployed along with the code in the `server`
directory. The resultant directory structure should resemble the following:

    /
    ├── index.js
    ├── node_modules
    │   └── [...]
    ├── package.json
    ├── public
    │   ├── assets
    │   │   ├── [...].png
    │   │   ├── index-[...].js
    │   │   └── index-[...].css
    │   ├── index.html
    │   └── leaderboard
    │       ├── assets
    │       │   ├── [...].png
    │       │   ├── index-[...].js
    │       │   └── index-[...].css
    │       └── index.html
    └── yarn.lock

### Docker

To build the Docker image locally, execute the following commands:

```bash
git clone https://github.com/IJMacD/catcher.git
cd catcher
docker build -t catcher .
```

Alternatively, the Docker image can be built without cloning first.

```bash
docker build -t catcher https://github.com/IJMacD/catcher.git
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

* Improve accessibility
* Add background audio and sound effects
* Iterate on collision detection implementation to improve catching accuracy
* Limit the speed the player can sail at, in order to increase difficulty
* Improve mobile experience; Implement touch handler
* Improve dark mode styling
* Add automoderation e.g. prohibit URLs and other objectionable user generated
content
