import type { User } from './models/user';

export const SAMPLE_USER: User = {
	id: 'user_1',
	forename: 'Jane',
	surname: 'Doe',
	email: 'jane.doe@example.com',
	// Password in sample is a placeholder; store hashed passwords in real apps
	password: 'hashed_password_placeholder',
	role: 'student',
	isActive: true,
	// Example purchase: user bought the first lesson
	purchases: [
		{ itemType: 'lesson', itemId: 'lesson_1', grantedAt: new Date().toISOString() },
	],
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

export const SAMPLE_USERS: User[] = [SAMPLE_USER];

import type { Lesson } from './models/lesson';
import type { Course } from './models/course';

export const SAMPLE_LESSON: Lesson = {
	id: 'lesson_1',
	title: 'Introduction & Setup',
	description: 'Overview of the course and dev setup',
	order: 1,
	durationMinutes: 20,
	meetingLink: { label: 'Zoom meeting', url: 'https://zoom.us/j/000000000' },
	youtubeLink: { label: 'Intro video', url: 'https://youtube.com/watch?v=abcdef' },
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

export const SAMPLE_COURSE: Course = {
	id: 'course_1',
	name: 'Nuxt.js Essentials',
	slug: 'nuxtjs-essentials',
	description: 'A compact course to get started with Nuxt.js',
	instructorId: SAMPLE_USER.id,
	lessons: [SAMPLE_LESSON],
	isPublished: true,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

export const SAMPLE_COURSES: Course[] = [SAMPLE_COURSE];
