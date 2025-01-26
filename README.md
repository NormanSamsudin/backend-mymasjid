# backend-mymasjid

npm install express mongoose jsonwebtoken bcryptjs dotenv winston morgan
npm install -g nodemon 


node start.js staging
node start.js production
node start.js development

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
