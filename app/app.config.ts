export default defineAppConfig({
  ui: {
    colors: {
      primary: 'orange',
      neutral: 'stone', // Warm gray-brown that complements the ember theme
    },
    pageHero: {
      slots: {
        container: 'flex flex-col lg:grid pt-8 pb-24 sm:pt-12 sm:pb-32 lg:pt-16 lg:pb-40 gap-16 sm:gap-y-24'
      }
    },
    prose: {
      h1: {
        slots: {
          base: 'text-4xl text-highlighted font-bold mb-8 scroll-mt-[calc(45px+var(--ui-header-height))] lg:scroll-mt-(--ui-header-height)',
          link: 'inline-flex items-center gap-2'
        }
      },
      h2: {
        slots: {
          base: 'text-3xl text-highlighted font-bold mt-16 mb-8 scroll-mt-[calc(45px+var(--ui-header-height))] lg:scroll-mt-(--ui-header-height)',
        }
      },
      h3: {
        slots: {
          base: [
            'relative text-xl text-highlighted font-bold mt-16 mb-6 scroll-mt-[calc(32px+45px+var(--ui-header-height))] lg:scroll-mt-[calc(32px+var(--ui-header-height))] [&>a]:focus-visible:outline-primary [&>a>code]:border-dashed hover:[&>a>code]:border-primary hover:[&>a>code]:text-primary [&>a>code]:text-lg/6 [&>a>code]:font-bold',
            '[&>a>code]:transition-colors'
          ],
          leading: [
            'absolute -ms-8 top-0.5 opacity-0 group-hover:opacity-100 group-focus:opacity-100 p-1 bg-elevated hover:text-primary rounded-md hidden lg:flex text-muted',
            'transition'
          ],
          leadingIcon: 'size-4 shrink-0',
          link: 'group lg:ps-2 lg:-ms-2'
        }
      },
      p: {
        base: 'text-pretty'
      }
    }
  }
})
