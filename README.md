# Norm editor

**The Norm Editor** is an application built using web-based technologies that allows users to create interpretations of sources of norms in FLINT in a user-friendly and interactive way. The tool was built using [Vue.js](https://vuejs.org/) and [Quasar](https://quasar.dev/).
The app is deployed on [Netlify](https://www.netlify.com/) and uses Netlify functions (serverless functions, including Edge Functions) to extend back-end capabilities.

**Try it out:** A public version of the Norm Editor is hosted at https://norm-editor.netlify.app/ .

--- 

## Table of Contents

1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Installation & Usage](#installation--usage)
5. [API Endpoints](#api-endpoints)
6. [Development](#development)
7. [Environment Variables](#environment-variables)

---

## Features

- Modern interface using [Vue.js](https://vuejs.org/) (front-end framework) & [Quasar](https://quasar.dev/) (UI Components & Toolkit).
- Serverless back-end with [Netlify Functions](https://docs.netlify.com/functions/overview/) (API endpoints).
- [Netlify Edge Functions](https://docs.netlify.com/edge-functions/overview/)(Edge middleware) for middleware-like behaviour.
- Easy deployment and continuous integration with [Netlify](https://www.netlify.com/) (Hosting & CI/CD).
- Customizable UI.

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