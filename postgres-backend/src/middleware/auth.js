const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/index');

const authMiddleware = (requiredPermissionIds = []) => (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // Unauthorized if no token

  jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Forbidden if token is invalid

      req.user = user; // Store user data from the token

      const userPermissions = req.user?.role?.permissions || []; // Array of permission IDs

      // Logging for debugging
      // console.log("User Permissions (IDs):", userPermissions);
      // console.log("Required Permission IDs:", requiredPermissionIds);

      // Check for required permissions
      if (requiredPermissionIds.length > 0 && !requiredPermissionIds.some(permissionId => userPermissions.includes(permissionId))) {
          console.log("Access denied due to insufficient permissions.");
          return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
      }

      console.log("Access granted.");
      next(); // Proceed if the user meets permission requirements
  });
};


module.exports = authMiddleware;
