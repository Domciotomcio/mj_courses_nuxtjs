import type { User, PurchaseItem } from './user';

export interface AccessOptions {
  /** If true, treat course purchases as granting access to all lessons inside the course */
  expandCourse?: boolean;
  /** Optional expiry check: if true, don't grant access if expiresAt < now */
  respectExpiry?: boolean;
}

const defaultOptions: AccessOptions = { expandCourse: true, respectExpiry: true };

export function hasAccess(user: User | undefined | null, itemType: 'course' | 'lesson', itemId: string, opts?: Partial<AccessOptions>): boolean {
  if (!user) return false;
  const options: AccessOptions = { ...defaultOptions, ...(opts || {}) };

  const now = new Date();

  const purchases: PurchaseItem[] = user.purchases ?? [];

  // direct purchase check
  const direct = purchases.find(p => p.itemType === itemType && p.itemId === itemId);
  if (direct) {
    if (options.respectExpiry && direct.expiresAt) {
      return new Date(direct.expiresAt) > now;
    }
    return true;
  }

  if (itemType === 'lesson' && options.expandCourse) {
    // if user purchased the parent course, grant access
    // we don't have course->lesson mapping here; the caller can expand courseId and call hasAccess for course
    // As a lightweight heuristic: treat purchases where itemType is 'course' and itemId === itemId prefix 'course_'? no assumption
    // Instead, this helper only checks direct purchases and course purchases where itemId matches a provided course id.
    // For real expansion, pass a derived courseId via meta when granting course entitlement.
    const courseGrant = purchases.find(p => p.itemType === 'course' && p.meta?.grantedForLessonIds && Array.isArray(p.meta.grantedForLessonIds) && (p.meta.grantedForLessonIds as string[]).includes(itemId));
    if (courseGrant) {
      if (options.respectExpiry && courseGrant.expiresAt) return new Date(courseGrant.expiresAt) > now;
      return true;
    }
  }

  return false;
}

export function grantPurchase(user: User, purchase: PurchaseItem): User {
  user.purchases = [...(user.purchases ?? []), purchase];
  return user;
}
