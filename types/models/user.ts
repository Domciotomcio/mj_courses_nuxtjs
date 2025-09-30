/**
 * User model types
 *
 * This file defines the canonical shapes used for users across the app.
 * Keep this minimal and easy to extend for other models.
 */

/** Unique identifier for records */
export type ID = string;

/** Roles available in the system */
export type UserRole = 'student' | 'instructor' | 'admin';

/** Primary User shape stored in the database or returned from APIs. */
export interface User {
	/** Internal id */
	id?: ID;
	/** Given name */
	forename: string;
	/** Family name */
	surname: string;
	/** Unique email used for login */
	email: string;
	/** Hashed password. Not returned in public views. */
	password?: string;
	/** Optional avatar url */
	avatarUrl?: string;
	/** Role of the user */
	role?: UserRole;
	/** Is the account active */
	isActive?: boolean;
		/** Purchased entitlements for quick access checks */
		purchases?: PurchaseItem[];
	/** Timestamps are ISO strings */
	createdAt?: string;
	updatedAt?: string;
}

	/** Lightweight purchase/entitlement stored on the user for fast access checks */
	export interface PurchaseItem {
		itemType: 'course' | 'lesson';
		itemId: ID;
		grantedAt: string;
		expiresAt?: string;
		meta?: Record<string, unknown>;
	}

/** Payload used when creating a user (password required) */
export type UserCreate = Pick<User, 'forename' | 'surname' | 'email' | 'password'> & Partial<Pick<User, 'role' | 'avatarUrl'>>;

/** Public view of a user (never include password) */
export type UserPublic = Omit<User, 'password'>;

/** Credentials shape for auth endpoints */
export interface UserCredentials {
	email: string;
	password: string;
}

/** Simple helper to clear sensitive fields from a user object */
export function toPublic(user: User): UserPublic {
	// shallow copy without password
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password, ...rest } = user as User & { password?: string };
	return rest;
}
