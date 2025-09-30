import { hasAccess, grantPurchase } from '../types/models/access';
import { SAMPLE_USER, SAMPLE_LESSON, SAMPLE_COURSE } from '../types/sample-data';

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

// Clone sample user so we don't mutate module state inadvertently
const user = JSON.parse(JSON.stringify(SAMPLE_USER));

// user already has purchase for lesson_1 in sample data
assert(hasAccess(user, 'lesson', SAMPLE_LESSON.id!), 'User should have access to SAMPLE_LESSON');

// user should not have access to a different lesson
assert(!hasAccess(user, 'lesson', 'lesson_2'), 'User should not have access to lesson_2');

// grant course and check
const courseGrant = { itemType: 'course' as const, itemId: SAMPLE_COURSE.id as string, grantedAt: new Date().toISOString(), meta: { grantedForLessonIds: [SAMPLE_LESSON.id as string] } };
grantPurchase(user as any, courseGrant as any);
assert(hasAccess(user, 'lesson', SAMPLE_LESSON.id!), 'After course grant, user should still have access to SAMPLE_LESSON');

console.log('hasAccess tests passed');
