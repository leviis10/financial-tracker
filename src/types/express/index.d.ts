declare namespace Express {
  interface Request {
    user?: import("mongoose").HydratedDocument<
      import("../../models/User").IUser,
      import("../../models/User").UserMethods
    >;
  }
}
