const admin = (req, res, next) => {
    if (req.user.role !== 'admin') {
       return res.status(403).send({ error: 'Require Admin Role' });
    }
    next();
   };
   
   module.exports = admin;
   