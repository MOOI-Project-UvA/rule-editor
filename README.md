# Norm editor

Tne Norm Editor is an application, built using web-based technologies, which allows a user to create interpretations of sources of norms in FLINT in a user-friendly and interactive way. The tool was built using [Vue.js](https://vuejs.org/) and [Quasar](https://quasar.dev/).

**Try it out:** A public version of the Norm Editor is hosted at https://norm-editor.netlify.app/ .

The develop branch is deployed at [https://develop--norm-editor.netlify.app/](https://develop--norm-editor.netlify.app/). This environment is used for testing new features and bug fixes before they are merged into the main branch.

## Running the Norm editor locally

To run the editor locally for development purposes. You can do the following:

### Install node.js

Make sure that you have installed [node.js](https://nodejs.org/en).

### Go to the gui directory

From project root, navigate to the `gui` folder:

```bash
cd gui/
```

### Install the necessary dependencies
```
npm install
```

### Compile the code and hot-reloads for development
```bash
npm run dev
```

By default, `vite` allocates `port 5137` to serve the application. Once the app is running, you can view the UI at `localhost:5137`. If you would like to use another port, you can also pass the additional `--port=XXXX`parameter: 
```bash
npm run dev -- --port=XXXX
```

You can also pass the `--open` parameter to have the UI automatically opened in a new browser tab:

```bash
npm run dev -- --open
```

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.