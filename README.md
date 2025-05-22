# Norm editor

**The Norm Editor** is an application built using web-based technologies that allows users to create interpretations of 
sources of norms in FLINT in a user-friendly and interactive way. The tool was built using [Vue.js](https://vuejs.org/) and [Quasar](https://quasar.dev/).
The app is deployed on [Netlify](https://www.netlify.com/) and uses Netlify functions (serverless functions, including Edge Functions) to extend back-end capabilities.

**Try it out:** A public version of the Norm Editor is hosted at https://norm-editor.netlify.app/ .

--- 

## Table of Contents

1. [Project Description](#project-description)
2. [Features](#features)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Development](#development)
5. [Environment Variables](#environment-variables)
6. [Contributing](#contributing)
7. [License](#license)

---

## Project Description

The Norm Editor is a web application for interpreting normative tasks. To use the editor, a task is defined and the normative text (sources) describing the task and the constraints for its execution are collected and imported into the editor. The editor allows users to mark components (e.g., articles, sections, or sentences) of the source as relevant or irrelevant to the task. Relevant sources can be annotated.

The current version of the Editor can only be used to create FLINT interpretations. The editor is designed so that any method or interpretation scheme can be used for interpreting normative text that results in (executable) norms or rules. The Editor allows users to get automated recommendations, while working on their interpretation by using the [FlintFiller](https://gitlab.com/normativesystems/flintfillers/flintfiller-srl). This feature is experimental and available only for Dutch texts.

The Editor uses normative text in JSON or RDF format, according to the [Source of Norms Ontology](https://gitlab.com/normativesystems/knowledge-modeling/source-ontology). Text documents in .txt, .xml, or .html format can be translated into this format by [the Choppr tool](https://gitlab.com/normativesystems/choppr/choppr-standalone/-/blob/main/FAQ.md).

Interpretations made using the Norm Editor can be stored as JSON or RDF files locally on your computer or remotely to a [linked database/triple store](https://triplydb.com/). For more information on the supported formats, see the [FLINT ontology](https://gitlab.com/normativesystems/knowledge-modeling/flint-ontology).

---

## Features

- Modern interface using [Vue.js](https://vuejs.org/) (front-end framework) & [Quasar](https://quasar.dev/) (UI Components & Toolkit).
- Serverless back-end with [Netlify Functions](https://docs.netlify.com/functions/overview/) (API endpoints).
- [Netlify Edge Functions](https://docs.netlify.com/edge-functions/overview/)(Edge middleware) for middleware-like behaviour.
- Easy deployment and continuous integration with [Netlify](https://www.netlify.com/) (Hosting & CI/CD).
- Customizable UI.
- Store, share, and use interpretations locally in JSON or RDF formats, and publish as linked data knowledge graphs to the [TriplyDB platform](https://triplydb.com/).
- Automated recommendations for interpretations using FlintFiller (experimental feature, Dutch language only)

---

## Project Structure

    .
    ├── interpretations/            # List of example interpretations
    ├── gui/                        # UI code    
    │    ├── netlify/              
    │    │      ├── edge-functions/ # Edge functions
    │    │      └── functions/      # Serverless functions
    │    ├── public/                # Static assets (favicon, robots.txt, etc.)
    │    ├── src/
    │    │     ├── assets/
    │    │     ├── components/      # The components performing functionalities are here used by the views in the views/ 
    │    │     ├── helpers/         # Reusable functions and utilities that are used by components 
    │    │     ├── model/           # The data model on which the application is based on
    │    │     ├── services/        # the calls to the endpoints are defined here 
    │    │     ├── store/           # The centralized store for the components 
    │    │     ├── views/           # The main views of the UI are defined here 
    │    │     ├── App.vue          # Main Vue root component    
    │    │     └── main.js          # Application bootstrap JavaScript entry point (mounts Vue app).
    │    ├── .gitignore             # Git ignored files    
    │    ├── Dockerfile
    │    ├── .eslintrc.js           # ESLint code linting configuration.
    │    ├── .prettierrc.json       # Prettier configuration    
    │    ├── index.html             # application entry point, root DOM node   
    │    ├── package-lock.json      # Records the full, exact dependency tree and versions
    │    ├── package.json           # Project dependencies and scripts
    │    ├── .env                   # Environment variables
    │    └── vite.config.js         # Vite and dev server configuration, plugin registration
    ├── .gitignore                  # Git ignored files   
    ├── docker-compose.yml
    ├── netlify.toml                # Netlify build, functions and routing configuration
    ├── LICENSE                     # Project license
    └── README.md                   # Project documentation

## Getting started 

### Prerequisites

- [Node.js](https://nodejs.org/en) (version <code>18.x</code> or later recommended)
- [npm](https://www.npmjs.com/)
- [Netlify CLI](https://www.netlify.com/products/dev/) (version <code>17.38</code> has been used) for local function testing

To run the editor locally for development purposes. You can do the following:

### Clone the repository

```bash
git clone git@gitlab.com:normativesystems/ui/interpretation-editor.git
cd interpretation-editor
```

### Go to the gui directory

From project root, navigate to the `gui` folder:

```bash
cd gui/
```

### Install the necessary dependencies
```
npm ci
```

### Local development
Start the development server with hot reload
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

Have in mind that by following the previous steps, you will not be able to use Netlify's serverless functions. If you want to develop and test Netlify functions locally, use the following command: 
```bash
netlify dev
```
This starts both SPA and Netlify Functions with live reload.

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

### Deploy to Netlify

Want to deploy immediately to Netlify? Click this button

[![Deploy to Netlify Button](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://gitlab.com/normativesystems/ui/interpretation-editor)

Clicking this button will create a new repo for you that looks exactly like this one, and sets that repo up immediately for deployment on Netlify.

---

## Development

### Netlify functions (Serverless API)

Netlify functions are in the <code>functions/</code> directory. To test them locally with the app: 

```bash
netlify dev
```

You can then make HTTP requests to <code>/.netlify/functions/[function-name]</code>.

For adding new functions, simply create a new <code>.js</code> in <code>functions/</code>.

You can find more information in the [Netlify Functions docs](https://docs.netlify.com/functions/overview/).

### Netlify Edge functions

Edge functions live in <code>/.netlify/edge-fuctions/</code>. See [Netlify Edge Functions docs](https://docs.netlify.com/edge-functions/overview/).

Routing for Edge functions is configured in <code>netlify.toml</code>.

---

## Contributing

We welcome contributions of all kinds!
Whether you're fixing a bug, adding features, improving documentation, or just suggesting an idea, we’re happy to collaborate.

### How to Contribute
1. Fork this repository.
2. Clone your fork (git clone https://gitlab.com/your-username/ui/interpretation-editor.git)
3. Create a branch for your changes:
```bash
git checkout -b my-feature-or-bugfix
```
4. Install dependencies
```bash
npm install
```
5. Make your changes (and add tests if possible).
6. Commit your changes:
```bash
git commit -am 'Add some feature'
```
7. Push to your forked repository:
```bash
git push origin my-feature-or-bugfix
```
8. Open a Merge Request (GitLab guide)

---

## License

This project is licensed under the <b>Apache License 2.0</b>.

See the <code>LICENSE</code> file for the details.