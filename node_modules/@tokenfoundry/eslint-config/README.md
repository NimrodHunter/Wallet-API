# @tokenfoundry/eslint-config

Please use this configuration to maintain a common and homogeneous code base.

## Install

Install this package as any other package with:

```sh
yarn add --dev eslint @tokenfoundry/eslint-config
```

Create a `.eslintignore` and add any files that are bundled, builded and/or _transpiled_:

```txt
!.eslintrc.js # allow self-formating

dist
lib
```

In the `package.json` file add the following in the `"scripts"` section:

```diff
 {
   ...
   "scripts": {
     ...
+    "lint": "eslint src .eslintrc.js",
   }
 }
```

> Assuming that the main code is in the `src` directory, change as needed.

### Configure for Node.js

Create a `.eslintrc.js` file in the root of your project and add the following:

```js
// .eslintrc.js

module.exports = {
  extends: ["@tokenfoundry/eslint-config"],
};
```

### Configure for ESNext (Babel) projects

Create a `.eslintrc.js` file in the root of your project and add the following:

```js
// .eslintrc.js

module.exports = {
  extends: ["@tokenfoundry/eslint-config/babel"],
};
```

### Configure for React.js and React-Native

Create a `.eslintrc.js` file in the root of your project and add the following:

```js
// .eslintrc.js

module.exports = {
  extends: ["@tokenfoundry/eslint-config/react"],
};
```

## Usage

To lint the files run:

```sh
yarn lint
```

To lint the files and **auto-format** run:

```sh
yarn lint --fix
```

### Custom rules

Modify the `.eslintrc.js` and add a `"rules"` field:

```js
// .eslintrc.js

module.exports = {
  extends: ["@tokenfoundry/eslint-config/react"],
  rules: [
    "react/prop-types": 0, // disabled
    "react/display-name": 1, // warning
    "react/jsx-boolean-value": 2, // throw error
  ],
};
```

## Publishing

To publish and update of this package run:

```sh
yarn publish --access=public
```
