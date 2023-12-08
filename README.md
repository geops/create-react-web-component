# Create React Web Component

[![NPM Version](https://img.shields.io/npm/v/@geops/create-react-web-component.svg)](https://www.npmjs.com/package/@geops/create-react-web-component)
[![Github License](https://img.shields.io/github/license/Silind/create-react-web-component)](https://github.com/Silind-Software/create-react-web-component/blob/master/LICENSE)
![Build Status](https://github.com/oterral/create-react-web-component/workflows/build/badge.svg)

This project is a fork of the archived but great [SimonHoiberg/create-react-web-component](https://github.com/SimonHoiberg/create-react-web-component).

It includes the React 18 support and removed all cli and styled stuff.

## How to use it

In your project:

```console
yarn add @geops/create-react-web-component
```

Creates the web-component using your React component:

```js
import ReactWebComponent from "@geops/create-react-web-component";
import MyReactComponent from "./MyReactComponent";

const attributes = {
  stringAttribute: "default value",
}

const props = {
  objectProp: { "key": "value"}
  arrayProp: ["foo"]
}

ReactWebComponent.setAttributes(MyReactComponent.attributes);
ReactWebComponent.setProperties(MyReactComponent.defaultProps);
ReactWebComponent.render(MyReactComponent, "my-web-component", { shadow: false });
```

Then load your module in a HTML page

```html
<html>
  <head>
    <script type="text/javascript" src="your module bundle file"> </script>
  </head>
  <body>
    <my-web-component id="myWebComponent" string="foo"></my-web-component>
    <script>
      const elt = doucment.getElementById('myWebComponent');

      console.log(elt.stringAttribute); // --> "default value"
      console.log(elt.objectProp); // --> "{ "key": "value" }"
      console.log(elt.arrayProp); // --> "['foo']"
    </script>
  </body>
</html>
```

## Contributing

### Getting Started

```console
yarn install
yarn test
```

### Issuess

In the case of a bug report, bugfix or a suggestions, please feel very free to open an issue.

### Pull request

Pull requests are always welcome, and I'll do my best to do reviews as fast as I can.

## License

This project is licensed under the [MIT License](https://github.com/Silind-Software/create-react-web-component/blob/master/LICENSE)

## Get Help

Read more about using Web Components with React on the [official React Docs](https://reactjs.org/docs/web-components.html)

- If appropriate, [open an issue](https://github.com/oterral/create-react-web-component/issues/new) on GitHub
