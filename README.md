# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## SRC Directory

All folders and components are contained within this `primary directory`.

"In the 'src' directory, the [components], [icons], [pages], [store], and [utils] folders are located."

**To ensure consistency and maintain the project's visual identity, all CMS icons used in the project are stored in the `icons` folder within the 'src' directory.**

## Pages

**The `pages` folder, which is connected by React Router DOM version 6, holds all the components needed to display multiple dashboards for the CMS user. This folder plays a crucial role in organizing and structuring the project's frontend architecture, enabling seamless navigation and user experience.**

## Store

**The `store` folder contains the [features] subfolder which holds all the Redux slices and a [store.tsx] file that combines all the slices using reducers. This structure helps to maintain a centralized state management system for the project, enabling efficient data flow and easier debugging.**

## Utils

**The `utils` folder contains a subfolder called [protectedroutes] which holds a TypeScript file named [protectedroutes.tsx]. This file takes all the components to be rendered as a prop and only displays the authenticated pages in the sidebar, protecting them based on the current user's authentication details that are stored at the time of login. This feature helps to ensure that only authorized users can access protected pages, enhancing the project's security and user experience.**

## Folder Structure of the components inside [pages] folder

**"Within the [pages] folder, each subfolder holds an [index.tsx] file and corresponding component folders that contain the elements to be rendered. To prevent an overly large [index.tsx] file, data is passed to these components via props. This design facilitates a more modular and organized codebase, thereby making the project easier to maintain and update as the development cycle progresses."**

## App.tsx

**Fundamental to the project's frontend architecture and user experience is the `app.tsx` file, which serves as the core file. This file imports all the components from the [pages] folder and establishes routes using React Router DOM version 6.. It also passes these components to the [protectedroutes.tsx] file within the [utils] folder to enable authentication and restrict access to authorized users. The 'app.tsx' file thus plays a critical role in defining the project's organization, authentication, and user experience.**
