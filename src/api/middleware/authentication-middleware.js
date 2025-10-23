import UnauthorizedError from "../../domain/errors/unauthorized-error.js";

const isAuthenticated = (req, res, next) => {
  // Development-friendly auth shim.
  // Priority order:
  // 1) X-User-Id header (easiest for local dev)
  // 2) Authorization: Bearer <userId>
  // In production, replace with Clerk verification and enrich req.auth().

  const headerUserId = req.header("x-user-id");
  const authHeader = req.header("authorization");

  let userId = headerUserId || null;
  if (!userId && authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    userId = authHeader.substring(7).trim();
  }

  if (!userId) {
    return next(new UnauthorizedError("Authentication required"));
  }

  req.auth = () => ({ userId });
  next();
};

export default isAuthenticated;
