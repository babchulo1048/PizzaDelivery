// // abilities.js
// import { Ability } from '@casl/ability';

// export const defineAbilitiesFor = (role) => {
//   const permissions = {
//     customer: [
//       { action: 'read', subject: 'OrderHistory' },
//       { action: 'read', subject: 'Order' },
//     ],
//     super_admin: [
//       { action: 'manage', subject: 'all' }, // Full access
//     ],
//   };

//   return new Ability(permissions[role] || []);
// };