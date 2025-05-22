# Norm editor

**The Norm Editor** is an application built using web-based technologies that allows users to create interpretations of 
sources of norms in FLINT in a user-friendly and interactive way. The tool was built using [Vue.js](https://vuejs.org/) and [Quasar](https://quasar.dev/).
The app is deployed on [Netlify](https://www.netlify.com/) and uses Netlify functions (serverless functions, including Edge Functions) to extend back-end capabilities.

**Try it out**

There are two public versions of the Norm Editor available:

- Stable version: 
  The most stable release hosted at https://norm-editor.netlify.app/.
- Latest (preview) version:
  Includes the newest features and experimental changes (not fully tested or stable) hosted at https://develop--norm-editor.netlify.app/.

Feel free to explore both!

--- 

## Table of Contents

1. [Project Description](#project-description)
2. [Features](#features)
3. [User Manual](#user-manual)
4. [Data Model](#data-model)
5. [Getting Started](#getting-started)
6. [Project Structure](#project-structure)
7. [Development](#development)
8. [Environment Variables](#environment-variables)
9. [Contributing](#contributing)
10.[License](#license)

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

## User Manual

### Interface overview

The interface of Rule editor consists of five screens:
1. Define a task
2. Collect sources
3. Interpret sources
4. Validate interpretations (not yet in use)
5. Perform task (not yet in use)

### Define a task (step 1)
In the current version one is required to start by defining a task and to edit three fields

| Field       | Explanation                                                    | Example             |
| ----------- | -------------------------------------------------------------- | ------------------- |
| Editor      | Field to register the name of the person using the rule editor | Robert van Doesburg |
| Label       | Label to refer to the task                                     |                     |
| Description | Description of the task                                        |                     |

If one of the fields **Editor**, **Label** or **Description** is empty it is impossible to continue (**click on button**) to the next screen.
{In a future release it will be possible to navigate all screens without restrictions.}

### Collect sources (step 2)
In the screen for collecting sources there are three ways for adding sources to the editor:

| Field                                | Explanation                                                | Example                            |
| ------------------------------------ | ---------------------------------------------------------- | ---------------------------------- |
| Add source from server               | Field to add a source from the Rule editor server          | General Data Protection Regulation |
| Add source from Triply               | Field to add a source from the Triply linked data store    | Not yet available                  |
| ![[Pasted image 20250121110444.png]] | A button that allows to add a source from local filesystem | mydrive/AI_Act.json                |

Select the source or sources you consider relevant in relation to the task you are working on.

Use the checkboxes to select or deselect text fragments. There are also buttons to **select all** or to **deselect all**. 

You can always get back to this screen to add additional sources, or remove redundant sources or text fragments.

Click on the **continue** button to get to the interpretation screen, or on the **back** button. In this version of the software, the only way to navigate between screens is by using the **continue** button or the **back** button.

The buttons for the steps at the top of the screen can only be used when you are in step 3 (interpret sources).
### Interpret sources (step 3)
The interpretation screen consists of a column on the left that contains the selected sources, and a screen for making FLINT frames on the right.
#### Expanding source text
You can use the **expand** and **collapse** icons to expand or collapse the text.
#### Selecting text
Select a text fragment. You can select anything from a single word to multiple lines.

When you click on the selected lines, you can create **frames** of the type **act**, **claim**, or **fact**.
#### Making frames

##### Facts
When you make your first interpretations, start by making some **facts**. 

You create a **fact** by selecting a text fragment, click on the selected fragment and click on the **fact** button. In the right side of the screen a **fact frame** emerges.

The selected text appears in the fields **short name** and **full name**. If necessary one can make changes in the text, e.g. change the conjugation of an action from the *present perfect* to the *present simple tense*.

For **facts** that refer to a longer text fragment, a short name can be added. The fact consists of:
- the *text fragment* from a *source*
- the *full name*, that is basically the same as the a literal text from the fragment, adjustments can be made regarding to:
	- the conjugation of the **action**,
	- interpunction issues,
	- making a readable sentence in case of the combination of multiple fragments from a single sentence, or even from multiple sentences,
	- making implicit information explicit (add a comment to explicitly lay down the implication).
- a *short name* for longer text fragments.

An examples are given below.
###### Fact types and roles
You can classify **facts** as **agent**, **action**, **object**, or **duty**. (The classification *condition* will be added soon, until then **facts** that do not have a classification is used for *conditions*).

Whether a **fact** can be classified as an **agent**, **action**, **object**, or **duty** depends on the role it has in **act frames** or **claim frames**.

**Agents** can have the role of **actor** or **recipient** in an **act frame**, or that of **claimant** or **duty holder** in **claim frames**.

**Actions** are verbs used in **act frames**.

**Objects** are the things an **action** refers to, or the thing created or terminated as the result of a *valid act*.

**Duties** refer to **acts** that must be executed in the future by (or on behalve of) a **duty holder** for a **claimant**. In other words every **duty** is created by an **act** and can be terminated by another **act**.

###### An example: Article 4 and 5 GDPR
Search for **agents** (persons that can have the role of *actor*, *recipient*, *claimant*, or *duty holder*, e.g. a *processor*, a *controller*, or *data subject* ), **actions** (e.g. *processing*, *collection*, *erasure*), **objects** (e.g. *personal data*, or *collected data*), **conditions** (e.g. *1. Personal data shall be: (a) processed lawfully, fairly and in a transparent manner in relation to the data subject (‘lawfulness, fairness and transparency’);*)

The *data subject*, *processor* and *controller* can be found in Article 4(1),(7) and (8).

The action verbs that can be derived from *processing*, *collection*, *erasure* in Article 4(2) are: *process*, *collect* and *erase*.

Article 5 is about the processing of *personal data*, Article 5(1)(b) is about *collected personal data* (the result of *collecting personal data*).

The condition that *1. Personal data shall be: (a) processed lawfully, fairly and in a transparent manner in relation to the data subject (‘lawfulness, fairness and transparency’);* can, e.g., be transformed to the **long name** *personal data shall be processed lawfully, fairly and in a transparent manner in relation to the data subject (‘lawfulness, fairness and transparency’)*. The **short name** could be, e.g., *personal data shall be processed lawfully, fairly and in a transparent manner*.
##### Acts
One can create **acts** in two ways:
1. by selecting one or more sentences and qualify those sentences as an **act** frame,
2. by selecting **fact frames**, made as shown above, and give them a role in an **act** frame.

For making core-acts (the combination of an *action*, the *actor* performing the action, the *object* that is acted upon and the *recipient* of the result of the action) is is advised to select sentences.

Selecting *actions*, *actors*, *objects* and *recipients* from random sentences, one can create nonsensical **acts**. **Acts** should be related to one or more specific sentences.
##### Claims
**Claims** contain a **duty**, a **claimant** and a **duty holder**. The **claimant** holds a claim that the **duty holder** fulfills the **duty**.

The **duty** should be related to one or more **acts** that can create the **duty** and one or more **acts** that terminate the **duty**.
### Validate interpretations (step 4)
Not yet available.
### Perform task (step 5)
Not yet available.
## Feature requests and bug reports
Would you like to report a bug or request a new feature? Please open an issue on in the [rule editor repository](https://gitlab.com/normativesystems/ui/interpretation-editor/-/issues) on GitLab.


---

## Data Model

The tool uses an internal data structure that differs slightly from the JSON and RDF format in which the interpretations are stored.

The definitions of the classes used in the tool can be found in the folder `model`. The main classes are:

- `frame` This is a class representing a frame. It is the superclass of `act`, `fact`, and `claim_duty`. Each frame has the following attributes:
    - _id_ A unique id, generated when a frame is instantiated.
    - _typeId_ The name of the frame's type (one of 'fact','act','claim_duty')
    - _shortName_ A short label as displayed in the frame list.
    - _fullName_ The full name of the frame, displayed when hovering the frame in the frame list.
    - _annotations_ A list of `annotation` objects. See below for a detailed explanation of an annotation.
    - _comments_ A list of `comment` objects. These are remarks and considerations that the user can store as notes attached to the frame when creating the interpretation.
- `fact` A frame of type _fact_. In addition to the attributes inherited from `frame` it has:
    - _subTypeIds_ A possibly empty list of subtype id's. A fact can have zero, one, or more subtypes. Valid subtype id's are: 'agent', 'action', 'object', 'duty', 'condition'.
    - _subDivision_ An object of type `booleanConstruct` representing a subdivision of a fact. A fact can consist of other facts, but not necessarily. This attribute speficies how a fact is subdivided. See below for an explanation of a booleanConstruct.
- `act` A frame of type _act_. In addition to the attributes inherited from `frame` it has attributes for the roles of an act frame:
    - _action_ An object of type `fact` representing the action of an act
    - _actor_ An object of type `fact` representing the actor of an act
    - _object_ An object of type `fact` representing the object of an act
    - _precondition_ A `booleanConstruct` representing a fact or a combination of facts that form the precondition of an act 
    - _recipient_ An object of type `fact` representing the recipient of an act
    - _creates_ A list of zero or more `fact` objects created by an act
    - _terminates_ A list of zero or more `fact` objects terminated by an act

    In addition, an act has auxiliary attributes, not part of the data model:
    - _activeField_ The role of the act that is currently selected by the user
    - _generateLabelAutomatically_ If true, labels (_shortName_ and _fullName_) are generated automatically for the act
- `claimduty` A frame of type _claim-duty_. In addition to the attributes inheried from `frame` it has attributes for the reles of a claim-duty frame:
    - _duty_ An object of type `fact` representing the duty of a claim-duty
    - _claimant_ An object of type `fact` representing the claimant of a claim-duty
    - _holder_ An object of type `fact` representing the holder of a claim-duty

    In addition, a claim-duty has auxiliary attributes, not part of the data model:
    - _activeField_ The role of the claim-duty that is currently selected by the user
    - _generateLabelAutomatically_ If true, labels (_shortName_ and _fullName_) are generated automatically for the claim-duty

- `booleanConstruct` This class is used to specify a combination of frames. Frames are combined using functions, e.g. boolean operators like OR and AND. A `booleanConstruct` can be nested: it can combine other boolean constructs as in: `booleanConstruct_1` AND `booleanConstruct_2`. A `booleanConstruct` is a tree, where the leafs are _frames_ and all other nodes are _booleanConstructs_. It has the following attributes:
    - _frame_ This attributes holds a frame in case the booleanConstruct is a leaf, i.e. it is a single frame, not a combination of frames.
    - _children_ If the booleanConstruct is not a leaf (i.e. _frame_ is not null), this attribute is a list of booleanConstruct objects.
    - _operatorToJoinChildren_ The function with which to join the childeren, e.g. a boolean operator.
    - _isNegated_ If a frame is specified, this attribute tells whether or not the frame should be negated (i.e. the unary boolean function NOT is applied)

- `sourceDocument` This class holds a source document, e.g. the content of a law like the _Participatiewet_. Its constructor reads a jsonLD object and parses it into a nested structure of sentence objects. The leafs of this structure are individual sentences. The nodes higher in the hierarchy represent paragraphs, chapters, etc. It has these attributes:
    - _title_ The title of the source document
    - _sentenceTree_ A nested structure of `sentence` objects

- `sentence` The text of a sentence, or a heading (i.e. label of a heading, paragraph, section). The text of a sentence (or heading) is divided in snippets (see below) so that an annotation of a frame can contain _part_ of a sentence, and not necessarily complete sentences. Its most important attributes are:
    - _sourceDocument_ The `sourceDocument` this sentence is part of
    - _snippets_ A list of `snippet` objects that comprises this sentence
    - _children_ If this sentence is a section or other higher-level element in the document: a list of `sentence` objects that together form this section
    

- `snippet` An atomic piece of text. The text is specified as a character range in a sentence. The snippet refers to all annotations that it is part of. Its attributes are:
    - _id_ A unique identifier
    - _sentence_ The sentence object the snippet is part of
    - _characterRange_ The start and end index of the character range within the sentence
    - _annotations_ The annotations that the snippet is part of

- `annotation` This object links snippets to a frame. The snippets form the annotation of the frame. Its attributes are:
    - _id_ A unique identifier
    - _frame_ The `frame` object that this is the annotation of
The link between snippets and annotation is stored in the snippets, see above. Auxiliary attributes used for drawing coloured lines under the source text are:
    - _nrSnippets_ Number of snippets of this annotation
    - _verticalPosition_ The vertical position of the coloured line that marks this annotation in the source text



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

---

## Getting started 

### Prerequisites

- [Node.js](https://nodejs.org/en) (version `18.x` or later recommended)
- [npm](https://www.npmjs.com/)
- [Netlify CLI](https://www.netlify.com/products/dev/) (version `17.38` has been used) for local function testing

### Dependencies
- To connect to TriplyDB an access token with TRIPLY is needed. You can register [here](https://triplydb.com/) and become more familiar with their environment [here](https://docs.triply.cc/triply-db-getting-started/uploading-data/).
- To use the Netlify CLI an access token to authenticate with Netlify is needed. You can obtain this token using the Netlify UI. See the [docs](https://docs.netlify.com/cli/get-started/#authentication).

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

## Environment variables

The application requires several environment variables to function properly, especially for accessing external services such as TriplyDB.
Add these variables to your Netlify dashboard or a local .env file as appropriate.


| Variable        | Explanation                                                                                                                                                        |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| TRIPLY_KEY_R    | API key required for reading from TriplyDB (Requires the creation of an account on the TRIPLY website and they can issue on for you)                               |
| TRIPLY_KEY_W    | API key required for writing to TriplyDB (Requires the creation of an account on the TRIPLY website and they can issue on for you)                                 |
| TRIPLY_ENDPOINT | Base URL of the TriplyDB instance/API  (Requires the creation of an account on the TRIPLY website)                                                                 |
| X_API_KEY       | Generated API key for authentication purposes. Used by the Edge function to redirect to the correct TRIPLY_DB serverless functions. Create your own.               |
| ALLOWED_DOMAINS | The domain from which the Edge function should expect the request.                                                                                                 |
| VITE_X_API_KEY  | API key required for fetching NLP predictions, and converting your interpretation in RDF and JSON to save them locally. Please contact us to generate one for you. |

Create an `.env` file in the `gui` folder and define the environment variable there. 

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