<template>
  <div class="flex flex-col items-center justify-center py-4">
    <UPricingPlan
      title="Płatność anulowana"
      description="Twoja płatność została anulowana lub przerwana. Nie pobrano żadnych środków."
      badge="Anulowano"
      :button="{ label: 'Wróć do kursów', color: 'primary', variant: 'outline', block: true, to: '/courses' }"
      :ui="{ price: 'text-red-600 text-4xl', badge: 'bg-red-100 text-red-700', button: 'mt-6' }"
      terms="Jeśli potrzebujesz pomocy, napisz do nas."
    />
  </div>
</template>