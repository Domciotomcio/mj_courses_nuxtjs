/**
 * Course model
 */
import type { ID } from './user';
import type { Lesson } from './lesson';

export interface Course {
  id?: ID;
  name: string;
  slug?: string; // url-friendly identifier
  description?: string;
  instructorId?: ID;
  lessons?: Lesson[]; // embedded lessons; in other setups this might be IDs
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CourseCreate = Pick<Course, 'name'> & Partial<Omit<Course, 'id' | 'createdAt' | 'updatedAt'>>;
