<script lang="ts" setup>

const course = {
  id: 1,
  title: 'Wychowanie dzieci do wiary',
  image_name: "course1.jpg",
  description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Vel id sapiente, dolorem doloremque pariatur excepturi corrupti error. Suscipit ad, aspernatur, perspiciatis atque sit consequuntur, accusamus ducimus inventore incidunt cum exercitationem?",
  meetings: [
    { id: 1, title: 'Spotkanie 1', label: 'Spotkanie 1', content: 'Content for meeting 1' },
    { id: 2, title: 'Spotkanie 2', label: 'Spotkanie 2', content: 'Content for meeting 2' },
    { id: 3, title: 'Spotkanie 3', label: 'Spotkanie 3', content: 'Content for meeting 3' }
  ]
};


</script>

<template>
  <div>
    <div class="mb-4 text-center py-8">
      <h1 class="font-bold text-3xl">{{ course.title }}</h1>
      <p class="text-gray-600">{{ course.description }}</p>
    </div>

    <div>
      <p>Spotkania</p>
      <UAccordion :items="course.meetings" />
    </div>

    <div>
      <UButton>Zakup kurs</UButton>
    </div>
  </div>
</template>
