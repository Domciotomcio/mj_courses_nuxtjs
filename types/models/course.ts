/**
 * Course model
 */
import type { ID } from './user';
import type { Lesson } from './lesson';
import type { Meeting } from './meeting';

/**
 * Course model
 *
 * Notes:
 * - The app sometimes uses `title` and `image_name` coming from Firestore documents
 *   so both `name` and `title` are accepted here to remain compatible.
 */
export interface Course {
  id?: ID;
  // canonical name used in some parts of the codebase
  name?: string;
  // UI-friendly title (used in templates)
  title?: string;
  slug?: string; // url-friendly identifier
  // image file name placed under /public/courses
  image_name?: string;
  // camelCase alternative for consumers that prefer it
  imageName?: string;
  description?: string;
  instructorId?: ID;
  lessons?: Lesson[]; // embedded lessons; in other setups this might be IDs
  price?: number;
  currency?: string;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
  meetings?: Meeting[];
}

export type CourseCreate = Pick<Course, 'name' | 'title'> & Partial<Omit<Course, 'id' | 'createdAt' | 'updatedAt'>>;
