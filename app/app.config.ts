export default defineAppConfig({
  ui: {
    pageHero: {
      slots: {
        title: 'text-4xl sm:text-6xl text-pretty tracking-tight font-bold text-highlighted',
        container: 'flex flex-col lg:grid py-15 sm:py-25 lg:py-20 sm:gap-y-24',
        wrapper: 'relative overflow-hidden before:absolute before:inset-0 before:-z-10 '
          + 'before:background-image: radial-gradient(circle at center, var(--tw-gradient-stops)) before:from-white/90 before:via-white/50 before:to-transparent before:backdrop-blur-[2px]'
      }
    },
    colors: {
      primary: 'red',
      neutral: 'slate'
    }
  }
})
