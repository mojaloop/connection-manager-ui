This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Introduction

This project is React/Redux application. It was bootstrapped with Create React App and it is completely built in Redux. 

  - [Available Scripts](#available-scripts)
  - [Source Code Structure](#source-code-structure)
  - [Section Structure](#section-structure)
  - [Libs And Frameworks](#libs-and-frameworks)
  
## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject` - NEVER DO THIS IF YOU DON'T KNOW WHAT YOU ARE DOING.

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.


## Source Code Structure
The project structure uses a module folder based approach; each folder in `src/App` starting with an uppercase letter is a section.

Every section contains several modules and it can contain sub sections. The project tends to organize sections the same way they are being displayed and routed.

## Section Structure

A section usually represents a view (React) and it's logic (Redux).
Sections can have one or more modules, depending on what are its functionalities.

Every section contains at least the `index.js` module which represents the view.


The logic is implemented in Redux, and its modules must be names as following:
- `actions.js` describe and exports the actions
- `reducers.js` describe and exports the reducers
- `selectors.js` describe and exports direct and combined selectors
- `validators.js` describe and exports the validators
- `constants.js` describe and exports contant values
- `{name}.css|scss` describes the styling
- `{name}.test.js` describes the unit and integration redux tests

Sub sections are wrapper in a folder starting with an uppercase character.

Example [DFSP APP Section](src/App/DFSP/)

| Name                   | Type      |
|------------------------|-----------|
| CertificateAuthorities | Section   |
| JWSCertificates        | Section   |
| TLSServerCertificates  | Section   |
| DFSP.css               | style     |
| reducers.js            | reducers  |
| selectors.js           | selectors |
| dfsp.test.js           | tests     |
| TLSClientCertificates  | Section   |
| actions.js             | actions   |
| Menu                   | Section   |
| HubEndpoints           | Section   |
| constants.js           | constants |
| Endpoints              | Section   |
| index.js               | view      |

## Libs And Frameworks
The main libraries used in the project are the following
- React
- Redux with [redux-thunk](https://github.com/reduxjs/redux-thunk) middleware, [react-redux](https://github.com/reduxjs/react-redux) bindings, [reselect](https://github.com/reduxjs/reselect) for building complex selectors
- [react-router-dom](https://github.com/ReactTraining/react-router#readme), [connected-react-router](https://github.com/supasate/connected-react-router) for routing
- [modusbox-ui-components](https://github.com/modusintegration/modusbox-ui-components) which provides the React UI inputs, components and the Redux Fetch middleware, Redux Validation
- [lodash](https://lodash.com/docs/)
- [moment.js](https://momentjs.com/docs/) for date and time handling
