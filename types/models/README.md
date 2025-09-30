Model conventions

- Each model lives in its own file under `types/models` and exports types/interfaces and helpers.
- The `index.ts` re-exports models for convenient imports: `import { User } from '~/types/models'`.
- Models should avoid bringing runtime dependencies. Keep them as plain TypeScript types or small helper functions.

User model notes

- `User` contains `forename`, `surname`, `email`, and `password` (hashed).
- `UserPublic` removes sensitive fields for public views.
- `UserCreate` is the payload for creating users.
