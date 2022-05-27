## Fintrack - Create shareable investment watchlists!

The participation of the retail investor in the securities market keeps on growing year on year and that means these new
investors would need some mechanism to be up to date on their securities of choice like stocks and mutual funds.

Watchlists are the go-to option for providing such a facility.
However, any typical investment or investment tracker platform only lets you create watchlists for your own account and not let them be shareable.
So there is a need for a platform where users can share their investments easily with their friends or relatives and Fintrack lets you do exactly that!

Check out the deployed web-app here: https://fintrack-420.netlify.app/

## Tech Stuff

- We used MERN stack for the web-app, supertest for backend testing and the React Testing Library for the frontend testing.
- DevOps principles were also followed throughout the development process via CI/CD pipelines which was done via Jenkins & Ansible. 
- Morgan logger was used for logging and a Grok pattern was used to extract fields from the generated logs.
- The application was containerized into two Docker images (frontend + backend, database is hosted on MongoDB Atlas) and managed via Docker Compose.
- We also deployed the front-end to Netlify and back-end to Heroku via GitHub Actions and this serves as our PaaS deployment.

##
Check out the report PDF for a ridiculously long breakdown of what's going on with the code of the app and its functionalities.

This web-app was made as the Major-Project for the CS816 - Software Production Engineering course @ IIIT-B M.Tech CSE.
