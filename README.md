# Wallet API

api to manage wallet and their calls

Environment Requirements:

* [Node.js 8.x.x](https://nodejs.org/en/) or higher.
* [Yarn](https://yarnpkg.com/)

## Recommended environment

* [Visual Studio Code](https://code.visualstudio.com/)
* [Jest ext](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest)
* [ESLint ext](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* [Babel JavaScript syntax](https://marketplace.visualstudio.com/items?itemName=mgmcdermott.vscode-language-babel)

## App design

The project structure was created based on the koa-starter repo to create an API-focused boiler plate.

The main concerns are:

### May not depend on singletons

This structure must not depend on __singletons__, but on `builder` functions that takes an object with the required variables named `options` following a cascade model.

```js
// subcomponent.js

module.exports = function builder(options) {
  const { models, config } = options;
  // ...
  return { /*... */ };
};
```

```js
// component.js

const subcomponent = require('./subcomponent');

module.exports = function builder(options) {
  const part = await subcomponent(options);
  // ...
  return { /*... */ };
};
```

It is preferred to use `async/await` functions, because it allows to compose asynchronous builders.

> The only singleton is the `const config = require("config");`.

## Development

Clone this repository:

```sh
git clone https://github.com/tokenfoundry/koa-starter-api.git
cd koa-starter-api
```

Install dependencies:

```sh
yarn install
```

To update the dependencies:

```sh
yarn upgrade-interactive
```

Run with:

```sh
yarn run dev
```

Make sure to check and change as needed the [`/config`](./config) directory and files.

## Linting and formating

> This project uses [tokenfoundry/eslint-config](https://github.com/tokenfoundry/eslint-config).

Run the linter with:

```sh
yarn lint
```

To lint the files and auto-format run:

```language
yarn lint --fix
```

## Local building with Docker

Build the image with:

```sh
docker build -t koastarterapi .
```

Start with:

```sh
docker run -i -t -p 3000:3000 koastarterapi
```

## Testing

Run the Jest test suite with:

```sh
yarn test
```

Run with coverage:

```sh
yarn test --coverage
```

> Add the `--watch` flag to keep the suite alive while coding.
