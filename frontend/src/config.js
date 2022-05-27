/*
  React Apps created with Create-React-App can use environment variables without the dotenv package
  But such variable names must begin with REACT_APP and that's why the environment variables are named as such here

  If we are in dev environment, i.e. local, then the backend and frontend URLs are based on localhost
  Otherwise use the values specified in the .env.development file

  local environment is specified by using the following package.json script,
    "local-start": "REACT_APP_STAGE=local npm start",
*/

const BACKEND_URL = process.env.REACT_APP_STAGE === 'local'? 'http://localhost:3001': process.env.REACT_APP_BACKEND_URL
const FRONTEND_URL = process.env.REACT_APP_STAGE === 'local'? 'http://localhost:3000': process.env.REACT_APP_FRONTEND_URL

export {  BACKEND_URL, FRONTEND_URL }