---
title: "Test Content Page"
description: "This is a test content file to verify Nuxt Content is working"
date: 2025-10-14
---

# Test Content is Working! 🎉

This is a **test markdown file** to verify that Nuxt Content is properly configured and working.

## Features to Test

Here are some features we're testing:

- Markdown rendering
- Bold and *italic* text
- Lists and formatting
- Custom components

## Using MDC Components

Let's test our custom components:

::alert{type="success" icon="i-lucide-check-circle"}
✅ If you can see this alert, the Alert component is working!
::

::alert{type="info" icon="i-lucide-info"}
ℹ️ This is an informational alert component.
::

## Card Grid Test

::card-grid
  ::card{icon="i-lucide-rocket" title="Fast"}
  Nuxt Content is blazingly fast!
  ::
  
  ::card{icon="i-lucide-code" title="Easy"}
  Write content in Markdown
  ::
  
  ::card{icon="i-lucide-sparkles" title="Powerful"}
  Full component support
  ::
::

## Testimonial Test

::testimonial{author="Test User" role="Developer"}
This is a test testimonial component. If you can read this, it's working perfectly!
::

## Quote Component Test

Here's an example of a beautiful quote/citation:

::quote{author="Anna Kowalska" role="absolwentka kursu"}
Ten kurs zmienił moje podejście do tematu. Polecam każdemu, kto chce się rozwijać!
::

::quote{author="Jan Nowak"}
Fantastyczne materiały i świetny prowadzący!
::

## Code Example

Here's some code:

```javascript
const test = 'Nuxt Content is awesome!'
console.log(test)
```

## Next Steps

If you can see all the components above rendered correctly, then Nuxt Content is working properly! 🎊

## Call to Action Component

::call-to-action{title="Zacznij naukę już dziś!" description="Dołącz do tysięcy zadowolonych uczestników naszych kursów"}
::

## Check List Component
::check-list{title="Oto co możesz zrobić dalej:"}
- Przejrzyj dokumentację Nuxt Content
- Dodaj więcej treści do swojego projektu
- Eksperymentuj z różnymi komponentami
- Ciesz się tworzeniem z Nuxt.js!
::

## Features Grid Component

Default features (no props needed):

::features-grid
::

Custom features with props:

::features-grid
::

