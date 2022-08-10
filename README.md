# Mining Idle Prototype

A WIP prototype of an incremental game using mainly React and React-Redux

## About

When I was first learning about React Redux, i've learnt that it can handle fast state updates really well. So I wanted to have a project that uses React Redux for all of its state management as i've done state management via components before.

I've also always wanted to make an incremental game even before i've started to learning programming, so here we are with a prototype incremental game that uses React Redux as it's state management tool.

It's heavily inspired by my favorite incremental game Antimatter Dimensions by Hevipelle.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Extra Packages

### React Redux
A predictable state container for JavaScript applications

### Redux Toolkit
The official, opinionated, batteries-included toolset for efficient Redux development

### Break_infinity.js
A replacement for https://github.com/MikeMcl/decimal.js/ for incremental games which need to deal with very large numbers (bigger in magnitude than 1e308, up to as much as 1e9e15) and want to prioritize speed over accuracy.