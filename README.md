# backend-mymasjid

npm install express mongoose jsonwebtoken bcryptjs dotenv winston morgan
npm install -g nodemon 

API Documentation : https://docs.google.com/spreadsheets/d/1gC_NmySqnViDUuHx7Os117JSPTqdeBs84SVJPgacHOo/edit?gid=0#gid=0

npm run  start:dev
npm run  start:prod
npm run  start:stag

need proper setup for which file need to set manually

/signup
{
  "username": "testuser",
  "password": "testpassword"
}

/login
{
  "username": "testuser",
  "password": "testpassword"
}

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
