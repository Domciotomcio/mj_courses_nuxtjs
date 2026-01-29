<script setup lang="ts">
import { addDoc, collection, doc, limit, orderBy, query, Timestamp, updateDoc } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'
import type { Course, Meeting } from '~/types/models'

// Restrict to authenticated users. Extend later with role checks if available.
definePageMeta({
  middleware: ['auth']
})

const db = useFirestore()
const toast = useToast()

const ADMIN_PASSWORD = 'a1b2c3d4'
const isUnlocked = ref(false)
const passwordInput = ref('')

onMounted(() => {
  if (process.client) {
    isUnlocked.value = sessionStorage.getItem('admin-pass-ok') === 'true'
  }
})

const unlockAdmin = () => {
  if (passwordInput.value === ADMIN_PASSWORD) {
    isUnlocked.value = true
    if (process.client) sessionStorage.setItem('admin-pass-ok', 'true')
    toast.add({ title: 'Panel odblokowany', color: 'success', icon: 'i-lucide-lock-open' })
    return
  }

  toast.add({ title: 'Nieprawidłowe hasło', color: 'error', icon: 'i-lucide-alert-triangle' })
}

const lockAdmin = () => {
  isUnlocked.value = false
  passwordInput.value = ''
  if (process.client) sessionStorage.removeItem('admin-pass-ok')
}

const courses = useCollection<Course & { id: string; course_markdown_name?: string; image_1x1?: string; meeting_url?: string; features?: string[] }>(collection(db, 'courses'))
const courseSearch = ref('')
const selectedCourseId = ref<string | null>(null)
const savingCourse = ref(false)
const savingMeeting = ref(false)

const filteredCourses = computed(() => {
  const list = courses.value || []
  if (!courseSearch.value) return list
  const term = courseSearch.value.toLowerCase()
  return list.filter(course => (course.title || '').toLowerCase().includes(term) || (course.course_markdown_name || '').toLowerCase().includes(term))
})

watch(courses, value => {
  if (!selectedCourseId.value && value?.length) {
    selectedCourseId.value = value[0].id
  }
})

const selectedCourse = computed(() => {
  if (!selectedCourseId.value) return null
  return courses.value.find(course => course.id === selectedCourseId.value) || null
})

const courseForm = reactive({
  title: '',
  subtitle: '',
  description: '',
  course_markdown_name: '',
  price: null as number | null,
  image_1x1: '',
  meeting_url: '',
  is_finished: false,
  dateInput: '',
  featuresText: ''
})

const resolveDate = (value: any): Date | null => {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value === 'object' && typeof value.toDate === 'function') return value.toDate()
  if (typeof value === 'object' && typeof value.seconds === 'number') return new Date(value.seconds * 1000)
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const toDateInputValue = (value: any) => {
  const date = resolveDate(value)
  if (!date) return ''
  const iso = date.toISOString()
  return iso.slice(0, 16)
}

watch(selectedCourse, course => {
  if (!course) return
  courseForm.title = course.title || ''
  courseForm.subtitle = course.subtitle || ''
  courseForm.description = course.description || ''
  courseForm.course_markdown_name = course.course_markdown_name || ''
  courseForm.price = typeof course.price === 'number' ? course.price : course.price ? Number(course.price) || null : null
  courseForm.image_1x1 = course.image_1x1 || ''
  courseForm.meeting_url = (course as any).meeting_url || ''
  courseForm.is_finished = Boolean((course as any).is_finished)
  courseForm.dateInput = toDateInputValue(course.date)
  courseForm.featuresText = Array.isArray((course as any).features) ? (course as any).features.join('\n') : ''
}, { immediate: true })

const updateCourse = async () => {
  if (!selectedCourseId.value) return
  savingCourse.value = true
  try {
    const payload: Record<string, any> = {
      title: courseForm.title,
      subtitle: courseForm.subtitle,
      description: courseForm.description,
      course_markdown_name: courseForm.course_markdown_name,
      image_1x1: courseForm.image_1x1,
      meeting_url: courseForm.meeting_url,
      is_finished: courseForm.is_finished
    }

    payload.price = courseForm.price === null || Number.isNaN(Number(courseForm.price)) ? null : Number(courseForm.price)
    payload.features = courseForm.featuresText
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean)
    payload.date = courseForm.dateInput ? Timestamp.fromDate(new Date(courseForm.dateInput)) : null

    await updateDoc(doc(db, 'courses', selectedCourseId.value), payload)
    toast.add({ title: 'Kurs zaktualizowany', color: 'success', icon: 'i-lucide-check-circle' })
  } catch (error) {
    console.error('Course update failed', error)
    toast.add({ title: 'Błąd zapisu', description: 'Sprawdź konsolę po szczegóły.', color: 'error', icon: 'i-lucide-alert-triangle' })
  } finally {
    savingCourse.value = false
  }
}

const emptyMeetingsQuery = query(collection(db, 'courses', '__placeholder__', 'meetings'), limit(1))
const meetingsQuery = computed(() => {
  if (!selectedCourseId.value) return emptyMeetingsQuery
  return query(collection(db, 'courses', selectedCourseId.value, 'meetings'), orderBy('index', 'asc'))
})

type MeetingDoc = Meeting & {
  id: string
  date?: any
}

interface MeetingFormState {
  id?: string
  label: string
  description: string
  index: number | null
  dateInput: string
  video_url: string
  has_occurred: boolean
}

const meetings = useCollection<MeetingDoc>(meetingsQuery)
const selectedMeetingId = ref<string | null>(null)
const meetingForm = reactive<MeetingFormState>({
  id: undefined,
  label: '',
  description: '',
  index: null,
  dateInput: '',
  video_url: '',
  has_occurred: false
})

const resetMeetingForm = () => {
  selectedMeetingId.value = null
  meetingForm.id = undefined
  meetingForm.label = ''
  meetingForm.description = ''
  meetingForm.index = meetings.value?.length ? meetings.value.length + 1 : 1
  meetingForm.dateInput = ''
  meetingForm.video_url = ''
  meetingForm.has_occurred = false
}

watch(selectedCourseId, () => {
  resetMeetingForm()
})

watch(meetings, value => {
  if (!selectedMeetingId.value && !meetingForm.index) {
    meetingForm.index = value?.length ? value.length + 1 : 1
  }
})

const selectMeeting = (meeting: MeetingDoc) => {
  selectedMeetingId.value = meeting.id
  meetingForm.id = meeting.id
  meetingForm.label = meeting.label || ''
  meetingForm.description = meeting.description || ''
  meetingForm.index = typeof meeting.index === 'number' ? meeting.index : Number(meeting.index) || 1
  meetingForm.dateInput = toDateInputValue((meeting as any).date ?? meeting.timestamp)
  meetingForm.video_url = meeting.video_url || ''
  meetingForm.has_occurred = Boolean(meeting.has_occurred)
}

const saveMeeting = async () => {
  if (!selectedCourseId.value) return
  savingMeeting.value = true
  try {
    const payload: Record<string, any> = {
      label: meetingForm.label,
      description: meetingForm.description,
      index: Number(meetingForm.index) || 0,
      video_url: meetingForm.video_url,
      has_occurred: meetingForm.has_occurred
    }

    payload.date = meetingForm.dateInput ? Timestamp.fromDate(new Date(meetingForm.dateInput)) : null

    if (selectedMeetingId.value) {
      await updateDoc(doc(db, 'courses', selectedCourseId.value, 'meetings', selectedMeetingId.value), payload)
      toast.add({ title: 'Spotkanie zaktualizowane', color: 'success', icon: 'i-lucide-check-circle' })
    } else {
      await addDoc(collection(db, 'courses', selectedCourseId.value, 'meetings'), payload)
      toast.add({ title: 'Spotkanie dodane', color: 'success', icon: 'i-lucide-check-circle' })
    }
    resetMeetingForm()
  } catch (error) {
    console.error('Meeting save failed', error)
    toast.add({ title: 'Błąd zapisu', description: 'Sprawdź konsolę po szczegóły.', color: 'error', icon: 'i-lucide-alert-triangle' })
  } finally {
    savingMeeting.value = false
  }
}

const meetingModeLabel = computed(() => selectedMeetingId.value ? 'Edytuj spotkanie' : 'Dodaj spotkanie')
</script>

<template>
  <div v-if="isUnlocked" class="container mx-auto px-6 py-10 space-y-8">
    <PageTitle title="Panel administratora" subtitle="Zarządzaj kursami i spotkaniami" />

    <div class="flex justify-end">
      <UButton color="neutral" variant="ghost" icon="i-lucide-lock" label="Zablokuj" size="sm" @click="lockAdmin" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <UCard class="lg:col-span-1">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-sm text-muted">Kursy</p>
            <p class="text-lg font-semibold">Wszystkie kursy</p>
          </div>
          <UBadge color="primary" variant="solid">{{ courses?.length || 0 }}</UBadge>
        </div>
        <UInput
          v-model="courseSearch"
          icon="i-lucide-search"
          placeholder="Szukaj po tytule lub nazwie markdown"
          class="mb-4"
          size="lg"
        />
        <div class="space-y-2 max-h-[560px] overflow-y-auto">
          <button
            v-for="course in filteredCourses"
            :key="course.id"
            class="flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left transition hover:border-primary hover:bg-primary/5"
            :class="course.id === selectedCourseId ? 'border-primary bg-primary/5' : 'border-default'"
            @click="selectedCourseId = course.id"
          >
            <div class="flex-1">
              <p class="text-sm font-semibold">{{ course.title || 'Kurs bez tytułu' }}</p>
              <p class="text-xs text-muted">{{ course.course_markdown_name || 'Brak nazwy markdown' }}</p>
            </div>
            <UBadge v-if="course.is_finished" color="neutral" size="xs">Zakończony</UBadge>
          </button>
        </div>
      </UCard>

      <div class="lg:col-span-2 space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted">Kurs</p>
                <p class="text-lg font-semibold">Szczegóły</p>
              </div>
              <UButton :loading="savingCourse" icon="i-lucide-save" label="Zapisz kurs" @click="updateCourse" />
            </div>
          </template>

          <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Tytuł">
              <UInput v-model="courseForm.title" placeholder="Tytuł kursu" size="lg" class="w-full" />
            </UFormField>
            <UFormField label="Podtytuł">
              <UInput v-model="courseForm.subtitle" placeholder="Krótki podtytuł" size="lg" class="w-full" />
            </UFormField>
            <UFormField label="Opis" class="md:col-span-2">
              <UTextarea v-model="courseForm.description" :rows="4" placeholder="Opis kursu" class="text-base w-full" />
            </UFormField>
            <UFormField label="Cena (PLN)">
              <UInput v-model.number="courseForm.price" type="number" min="0" step="1" placeholder="199" size="lg" class="w-full" />
            </UFormField>
            <UFormField label="Nazwa pliku markdown">
              <UInput v-model="courseForm.course_markdown_name" placeholder="np. kurs-wiara" size="lg" class="w-full" />
            </UFormField>
            <UFormField label="Adres obrazka okładki">
              <UInput v-model="courseForm.image_1x1" placeholder="/courses/example.jpg" size="lg" class="w-full" />
            </UFormField>
            <UFormField label="Domyślny link do spotkań">
              <UInput v-model="courseForm.meeting_url" placeholder="https://zoom.us/..." size="lg" class="w-full" />
            </UFormField>
            <UFormField label="Data startu">
              <UInput v-model="courseForm.dateInput" type="datetime-local" size="lg" class="w-full" />
            </UFormField>
            <UFormField label="Status">
              <UCheckbox
                v-model="courseForm.is_finished"
                label="Kurs zakończony"
                size="lg"
              />
            </UFormField>
            <UFormField label="Funkcje (po jednej na linię)" class="md:col-span-2">
              <UTextarea v-model="courseForm.featuresText" :rows="5" placeholder="Cecha 1\nCecha 2" class="text-base w-full" />
            </UFormField>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted">Spotkania</p>
                <p class="text-lg font-semibold">{{ meetingModeLabel }}</p>
              </div>
              <div class="flex items-center gap-2">
                <UButton color="neutral" variant="ghost" icon="i-lucide-plus" label="Nowe" @click="resetMeetingForm" />
                <UButton :loading="savingMeeting" icon="i-lucide-save" label="Zapisz spotkanie" @click="saveMeeting" />
              </div>
            </div>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Kolejność">
              <UInput v-model.number="meetingForm.index" type="number" min="1" step="1" size="lg" class="w-full" />
            </UFormField>
            <UFormField label="Nazwa">
              <UInput v-model="meetingForm.label" placeholder="Tytuł spotkania" size="lg" class="w-full" />
            </UFormField>
            <UFormField label="Data">
              <UInput v-model="meetingForm.dateInput" type="datetime-local" size="lg" class="w-full" />
            </UFormField>
            <UFormField label="Link do nagrania">
              <UInput v-model="meetingForm.video_url" placeholder="https://youtube.com/watch?v=..." size="lg" class="w-full" />
            </UFormField>
            <UFormField label="Status spotkania">
              <UCheckbox
                v-model="meetingForm.has_occurred"
                label="Spotkanie odbyło się"
                size="lg"
              />
            </UFormField>
            <UFormField label="Opis" class="md:col-span-2">
              <UTextarea v-model="meetingForm.description" :rows="4" placeholder="Opis spotkania" class="text-base w-full" />
            </UFormField>
          </div>

          <div class="mt-6 border-t pt-4">
            <p class="text-sm font-semibold mb-3">Istniejące spotkania</p>
            <div v-if="meetings?.length" class="space-y-2 max-h-[360px] overflow-y-auto">
              <UCard
                v-for="meeting in meetings"
                :key="meeting.id"
                class="cursor-pointer transition hover:border-primary"
                :class="meeting.id === selectedMeetingId ? 'border-primary bg-primary/5' : 'border-default'"
                @click="selectMeeting(meeting)"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-semibold">{{ meeting.label || 'Spotkanie bez nazwy' }}</p>
                    <p class="text-xs text-muted">Kolejność: {{ meeting.index ?? 'n/d' }}</p>
                  </div>
                  <UBadge v-if="meeting.has_occurred" color="neutral" size="xs">Zrealizowane</UBadge>
                </div>
                <p class="text-xs text-muted mt-1 line-clamp-2">{{ meeting.description || 'Brak opisu' }}</p>
              </UCard>
            </div>
            <div v-else class="text-sm text-muted">Brak spotkań.</div>
          </div>
        </UCard>
      </div>
    </div>
  </div>

  <div v-else class="container mx-auto px-6 py-16 max-w-xl">
    <PageTitle title="Panel administratora" subtitle="Wprowadź hasło, aby kontynuować" />
    <UCard>
      <div class="space-y-4">
        <p class="text-sm text-muted">Panel chronimy prostym hasłem. Podaj hasło, aby odblokować dostęp.</p>
        <UFormField label="Hasło">
          <UInput
            v-model="passwordInput"
            type="password"
            placeholder="Wpisz hasło"
            size="lg"
            @keyup.enter="unlockAdmin"
          />
        </UFormField>
        <UButton icon="i-lucide-lock-open" label="Odblokuj" block size="lg" @click="unlockAdmin" />
      </div>
    </UCard>
  </div>
</template>
