# MJ Courses - AI Coding Agent Instructions

## Project Overview
E-commerce platform for Polish religious education courses using Nuxt 4, Firebase, Stripe, and Nuxt Content for dynamic course descriptions.

**Stack**: Nuxt 4.1.2 (SSR disabled), Vue 3, TypeScript, Nuxt UI 4.0, Nuxt Content 3.7.1, Firebase (VueFire), Stripe, Tailwind CSS

## Architecture & Key Patterns

### Content Management System
- **Course content lives in `/content/courses/`** as Markdown files (e.g., `wychowanie_dzieci_do_wiary.md`)
- Firestore courses link to content via `course_markdown_name` field (NOT `id` or `index`)
- Load content: `queryCollection('content').path('/courses/${course_markdown_name}').first()`
- Render with: `<ContentRenderer :value="page" class="prose dark:prose-invert max-w-none" />`

### MDC Components (Markdown Components)
Custom content components in `/app/components/content/`:
- `CheckList` - Lists with green checkmarks: `::check-list{title="..."}\n- Item\n::`
- `Quote` - Testimonials: `::quote{author="..." role="..."}\nText\n::`
- `ContentWithImage` - Text with side image: `::content-with-image{imageSrc="/path" imagePosition="left|right" imageSize="small|medium|large"}\nText\n::`
- `FeaturesGrid` - 4-column feature cards: `::features-grid{:features='[{...}]'}\n::` (supports custom JSON data)
- `CallToAction` - CTA banner: `::call-to-action{title="..." description="..."}\n::`

**Critical**: Props in MDC use `:propName='value'` syntax inside `{}` braces on component line, NOT as separate lines.

### Firebase & Authentication
- **Composable**: `useUser(userId)` fetches user from Firestore collection `users` by `uid` field
- **Auth middleware**: Apply with `definePageMeta({ middleware: ['auth'] })` in page `<script setup>`
- Current user: `useCurrentUser()` (VueFire composable)
- **Firestore collections**: `courses` (has `course_markdown_name`, `price`, `meetings`), `users` (has `uid`, `email`)

### Stripe Integration
- Checkout session: POST to `/api/create-checkout-session` with `{ courseId, userUid }`
- Server returns `{ url }` to redirect user to Stripe checkout
- Webhook handler: `/server/api/webhook.post.ts` processes payment events

### Styling & Theming
- **Primary color**: Orange (`app.config.ts`)
- **Dark mode**: `@nuxtjs/color-mode` with class strategy (no suffix)
- **Typography**: Global h3 styles in `/app/assets/css/main.css` (NOT in app.config.ts)
- **Prose config**: `app.config.ts` defines Nuxt UI prose slots for h1, h2, h3, p inside ContentRenderer
- **Responsive grids**: Use `not-prose max-w-full` classes to escape prose width constraints

### Type System
- Models in `/types/models/` - each file exports interfaces and re-exported via `index.ts`
- Import: `import { User, Course } from '~/types/models'`
- Avoid runtime dependencies in model files

## Development Commands
```bash
pnpm install      # Install dependencies
pnpm dev          # Dev server on localhost:3000 (check terminal for actual port)
pnpm build        # Production build
pnpm preview      # Preview production build
```

## Common Patterns

### Creating New Course Content
1. Add Markdown file: `/content/courses/course-slug.md` with frontmatter `title` and `subtitle`
2. Add Firestore document: `courses` collection with `course_markdown_name: "course-slug"`
3. Use MDC components for rich content layout
4. Images go in `/public/courses/`

### Adding MDC Components
1. Create in `/app/components/content/ComponentName.vue`
2. Use in markdown: `::component-name{prop="value"}\nContent\n::`
3. For lists/content inside, use `<slot />` and CSS `:deep()` selectors
4. Add `not-prose` class to escape prose styling when needed

### Page with Firestore + Content
```vue
<script setup>
const course = useDocument(doc(collection(useFirestore(), 'courses'), courseId))
const { data: content } = await useAsyncData(
  `content-${courseId}`,
  async () => {
    if (!course.value?.course_markdown_name) return null
    return queryCollection('content').path(`/courses/${course.value.course_markdown_name}`).first()
  },
  { watch: [course] }
)
</script>
<template>
  <ContentRenderer v-if="content" :value="content" class="prose dark:prose-invert max-w-none" />
</template>
```

### Auth-Protected Routes
```vue
<script setup>
definePageMeta({ middleware: ['auth'] })
// Page content only accessible to logged-in users
</script>
```

## Project-Specific Conventions
- **No SSR**: `ssr: false` in nuxt.config (client-side only app)
- **Package manager**: pnpm (lockfile present)
- **Icon library**: Lucide icons via Nuxt UI (`i-lucide-icon-name`)
- **Container pattern**: `container mx-auto px-4 py-8` for page layouts
- **Course meetings**: Stored as array in Firestore, rendered with `UAccordion`
- **Paragraph spacing in markdown**: Requires empty line between paragraphs (two line breaks)

## Key Files
- `/app/pages/courses/[id].vue` - Dynamic course detail page
- `/app/components/CoursePurchaseSummary.vue` - Reusable purchase component
- `/app/composables/use-user.ts` - User data fetching pattern
- `/nuxt.config.ts` - Firebase, Stripe, Content module config
- `/content/courses/*.md` - Course content sources
- `/app/assets/css/main.css` - Global typography and custom CSS

## Gotchas
- TypeScript may show false positives for auto-imports (useRoute, computed, etc.) - they work at runtime
- `queryContent` auto-import issues - restart dev server to regenerate `.nuxt/imports.d.ts`
- Prose max-width constraint - use `not-prose` and `max-w-full` for full-width components
- MDC prop syntax - `:features='[...]'` NOT `features='[...]'` for JSON data
- Grid breakpoints - `md:` is 768px, `xl:` is 1280px (standard Tailwind)
