# Netoviz

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Netoviz (**Ne**twork **To**pology **Vis**ualizer) is a tool to visualize network topology data that based on
[RFC8345](https://datatracker.ietf.org/doc/rfc8345/).

See also [Netomox (Netwrok topology modeling toolbox)](https://github.com/corestate55/netomox), the tool to construct RFC8345 based network topology data.

## Demo

The visualizer works on Heroku.

* https://netoviz.herokuapp.com/

## Directory

* `src`: Source code files of visualizer.
  * Codes are packed by webpack and stored in `dist` as `main.js`.
* `dist`: Distributed files. (`devServer`'s document-root)
* `dist/model`: Topology data files (json)

This visualizer depends on [D3.js v4](https://d3js.org/),
[Webpack](https://webpack.js.org/),
[Node.js](https://nodejs.org/ja/) and [NPM](https://www.npmjs.com/).

## Installation

### Install packages

Install Node.js and NPM at first in your system.

Install packages used by this visualizer (according to `package.json`).
```
npm install
```

### Run web server
To develop application, Use
```
npm run start
```
Then, it builds app as development mode,
run `webpack-dev-server` and opens `dist/index.html` with browser.

Or
```
npm run release-start
```
runs simple `Express` http server with built application.

### Build

Run `webpack` for development
```
npm run build
```
or 
```
npm run release-build
```
for production.

### Lint

Run `eslint`.
```
npm run lint
```
or
```
npm run lintfix
```
runs `eslint` with `--fix` option.

## Structure

```
 augmented topology data model        topology data structure       graph object structure        visualizer
 (RFC8346,                            (RFC8345)
 draft-ietf-i2rs-yang-l2-network-topology)                                               object
                                        +-----------+                   +-----------+    data    +-----------+
              +-------------------------| networks  |-------------------|  graphs   | =========> |visualizer |
              |                         +-----+-----+                   +-----+-----+ whole      +-----+-----+
        +-----+-----+                         |                               |       layers           |
        |   L2/L3   |                   +-----+-----+                   +-----+-----+            +-----+-----+
        |  network  |-----------------|>| network   |                   |  graph    | single     |operational|
        +-----+-----+                   +-----+-----+                   +-----+-----+ layer      |visualizer | event
              |                               |                               |                  +-----+-----+ handling
      +-------+-------+               +-------+-------+               +-------+-------+                |
      |               |               |               |               |               |                V
      |         +-----+-----+         |               |               |    node +-----+-----+    +-----+-----+
      |         |   L2/L3   |         |         +-----+-----+         |  object |  graph    |    |simulated  |
      |         |   node    |---------(-------|>|   node    | . . . . ( . . . . |   node    |    |visualizer | force
      |         +-----+-----+         |         +-----+-----+         |         +-----------+    +-----+-----+ simulation
+-----+-----+         |               |               |   tp-tp +-----+-----+         : tp             |
|   L2/L3   |         |         +-----+-----+         |    link |  graph    |         : object         V
|   link    |---------(-------|>|   link    | . . . . (. . . . .|   link    |         :          +-----+-----+
+-----------+         |         +-----------+         |         +-----------+         :          |single     |
                      |                               |               : tp-node       :          |visualizer | static
                +-----+-----+                         |               : link          :          +-----------+ graph
                |   L2/L3   |                   +-----+-----+         :               :                        object
                | term pts  |-----------------|>| term pts  | . . . . : . . . . . . . :
                +-----------+                   +-----------+
```

See more detail, [class diagram in fig directory](./fig/).
