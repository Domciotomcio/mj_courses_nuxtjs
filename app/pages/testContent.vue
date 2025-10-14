<script lang="ts" setup>
const route = useRoute()

// const myCustomPath = "/test-content"
 const myCustomPath = "/courses/wychowanie_dzieci_do_wiary"
// const myCustomPath = "/"

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(myCustomPath).first()
})

watchEffect(() => {
  if (page.value) {
    console.log('Loaded page content:', page.value)
  } else {
    console.log('No content found for path:', route.path)
  }
})

</script>

<template>
  <div>
    <ContentRenderer
      :value="page"
    />
  </div>
</template>