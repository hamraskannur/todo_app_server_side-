import jwt from 'jsonwebtoken'

export function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(200).send({
        message: "auth failed ",
      });
    }

    const [, token] = authHeader.split(" ");
    jwt.verify(
      token,
      'secret-key',
      (err, decodedToken) => {
        if (err) {
          return res.send({
            message: "auth failed ",
          });
        } else {
          req.user = { userId: decodedToken.userId };
          next();
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      status:false,
      message: "auth failed",
    });
  }
};