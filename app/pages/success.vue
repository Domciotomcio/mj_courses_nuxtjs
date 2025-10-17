<script lang="ts" setup>
import { useCurrentUser } from 'vuefire'

const currentUser = useCurrentUser()
const userId = computed(() => currentUser.value?.uid)
</script>

<template>
<div class="flex flex-col items-center justify-center py-4">
  <UPricingPlan
    title="Płatność zakończona!"
    description="Dziękujemy za zakup kursu. Twoja płatność została pomyślnie przetworzona."
    badge="Sukces"
    :features="['Dostęp do kursu został przyznany', 'Potwierdzenie wysłane na e-mail', 'Możesz już korzystać z materiałów', 'W razie pytań skontaktuj się z nami']"
    :button="{ label: 'Przejdź do swoich kursów', color: 'primary', variant: 'outline', block: true, to: `/users/${userId}/courses` }"
    :ui="{ price: 'text-green-600 text-4xl', badge: 'bg-green-100 text-green-700', button: 'mt-6' }"
  />
</div>
</template>