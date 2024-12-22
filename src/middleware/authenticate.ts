// import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";

// export function authenticate(req: Request, res: Response, next: NextFunction) {
//   /*
//   #swagger.security = [{
//             "bearerAuth": []
//     }]
//   */

//   const authorizationHeader = req.headers.authorization;

//   if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
//     return res.status(401).json({
//       error: "Unauthorized!",
//     });
//   }

//   const token = authorizationHeader.split(" ")[1];

//   try {
//     const user = jwt.verify(token, process.env.JWT_SECRET as string);
//     res.locals.user = user;
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       error: "Unauthorized!",
//     });
//   }
// }

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
    res.status(401).json({ error: "Unauthorized!" });
    return; // Pastikan fungsi berhenti di sini
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    res.locals.user = user;
    next(); // Lanjutkan ke middleware berikutnya
  } catch (error) {
    res.status(401).json({ error: "Unauthorized!" });
  }
}
