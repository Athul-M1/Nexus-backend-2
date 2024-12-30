//Authorisation
const jwt = require('jsonwebtoken')

const jwtMiddleware = (req, res, next) => {
   // console.log(req.body);
   try {
      const token = req.headers['authorization'].split(' ')[1]
      // console.log(token);
      const jwtResponse = jwt.verify(token, 'supersimplekey')
      // console.log(jwtResponse)
      req.payload = jwtResponse.id
      next()
   }
   catch (error) {
      res.status(401).send('Authorization Failed.... Please login')
   }
} 
module.exports = jwtMiddleware 