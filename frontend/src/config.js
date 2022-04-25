/*
  React Apps created with Create-React-App can use environment variables without the dotenv package
  But such variable names must begin with REACT_APP and that's why
  the environment variable is named such here
*/

const BACKEND_URL = process.env.REACT_APP_STAGE === 'local'? 'http://localhost:3001': process.env.REACT_APP_BACKEND_URL
const FRONTEND_URL = process.env.REACT_APP_STAGE === 'local'? 'http://localhost:3000': process.env.REACT_APP_FRONTEND_URL

export {  BACKEND_URL, FRONTEND_URL }