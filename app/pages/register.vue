<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

// Validation schema
const schema = z.object({
  forename: z.string().min(2, 'Imię musi mieć przynajmniej 2 znaki'),
  surname: z.string().optional(),
  email: z.string().email('Nieprawidłowy adres email'),
  password: z.string().min(6, 'Hasło musi mieć przynajmniej 6 znaków'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Hasła muszą być identyczne',
  path: ['confirmPassword']
})

type Schema = z.output<typeof schema>

// Form fields definition
const fields = [
  {
    name: 'forename',
    type: 'text' as const,
    label: 'Imię',
    placeholder: 'Jan',
    icon: 'i-lucide-user',
    required: true,
    hint: '*'
  },
  {
    name: 'surname',
    type: 'text' as const,
    label: 'Nazwisko (opcjonalnie)',
    placeholder: 'Kowalski',
    icon: 'i-lucide-user',
    hint: ''
  },
  {
    name: 'email',
    type: 'email' as const,
    label: 'Email',
    placeholder: 'jan@example.com',
    icon: 'i-lucide-mail',
    required: true,
    hint: '*'
  },
  {
    name: 'password',
    type: 'password' as const,
    label: 'Hasło',
    placeholder: '••••••••',
    icon: 'i-lucide-lock',
    required: true,
    hint: '*',
    help: 'Minimum 6 znaków'
  },
  {
    name: 'confirmPassword',
    type: 'password' as const,
    label: 'Potwierdź hasło',
    placeholder: '••••••••',
    icon: 'i-lucide-lock',
    required: true,
    hint: '*'
  }
]

// Loading state
const loading = ref(false)
const googleLoading = ref(false)
const error = ref<string | null>(null)
const providers = computed(() => [{
  label: 'Kontynuuj z Google',
  icon: 'i-simple-icons-google',
  color: 'neutral',
  variant: 'outline',
  block: true,
  loading: googleLoading.value,
  onClick: signInWithGoogle
}])

// Firebase composables
const auth = useFirebaseAuth()
const db = useFirestore()
const router = useRouter()
const toast = useToast()

async function ensureUserDocument(user: any) {
  if (!user?.uid || !db) return

  const userRef = doc(db, 'users', user.uid)
  const existing = await getDoc(userRef)

  if (!existing.exists()) {
    const [forename = '', ...rest] = (user.displayName || '').split(' ')
    const surname = rest.join(' ')

    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || '',
      forename,
      surname,
      courses: [],
      createdAt: new Date()
    })
  }
}

// Submit handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!auth) {
    error.value = 'Błąd inicjalizacji Firebase'
    return
  }

  loading.value = true
  error.value = null

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      event.data.email,
      event.data.password
    )

    // Create user document in Firestore
    const userDoc = {
      uid: userCredential.user.uid,
      email: event.data.email,
      forename: event.data.forename,
      surname: event.data.surname || '',
      courses: [],
      createdAt: new Date()
    }

    await setDoc(doc(db, 'users', userCredential.user.uid), userDoc)

    toast.add({ 
      title: 'Sukces', 
      description: 'Konto zostało utworzone pomyślnie',
      color: 'success' 
    })

    // Redirect to home or login page
    router.push('/')
  } catch (err: any) {
    console.error('Registration error:', err)
    
    // Handle Firebase errors with Polish messages
    if (err.code === 'auth/email-already-in-use') {
      error.value = 'Ten adres email jest już używany'
    } else if (err.code === 'auth/weak-password') {
      error.value = 'Hasło jest zbyt słabe'
    } else if (err.code === 'auth/invalid-email') {
      error.value = 'Nieprawidłowy adres email'
    } else {
      error.value = 'Wystąpił błąd podczas tworzenia konta. Spróbuj ponownie.'
    }

    toast.add({ 
      title: 'Błąd', 
      description: error.value,
      color: 'error' 
    })
  } finally {
    loading.value = false
  }
}

async function signInWithGoogle() {
  if (!auth) {
    error.value = 'Błąd inicjalizacji Firebase'
    return
  }

  googleLoading.value = true
  const provider = new GoogleAuthProvider()

  try {
    const result = await signInWithPopup(auth, provider)
    await ensureUserDocument(result.user)

    toast.add({
      title: 'Sukces',
      description: 'Zalogowano przez Google',
      color: 'success'
    })

    router.push('/courses')
  } catch (err: any) {
    console.error('Google registration error:', err)

    const isPopupClosed = err?.code === 'auth/popup-closed-by-user'
    error.value = isPopupClosed
      ? 'Okno logowania zostało zamknięte.'
      : 'Nie udało się zalogować przez Google. Spróbuj ponownie.'

    toast.add({
      title: 'Błąd',
      description: error.value,
      color: 'error'
    })
  } finally {
    googleLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4 min-h-[calc(100vh-200px)]">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        :fields="fields"
        :providers="providers"
        :loading="loading"
        title="Utwórz konto"
        description="Zarejestruj się, aby uzyskać dostęp do kursów"
        icon="i-lucide-user-plus"
        :submit="{ label: 'Utwórz konto', block: true, size: 'lg' }"
        @submit="onSubmit"
      >
        <template #validation>
          <UAlert 
            v-if="error" 
            color="error" 
            icon="i-lucide-alert-circle" 
            :title="error" 
          />
        </template>

        <template #footer>
          <div class="text-center text-sm text-muted">
            Masz już konto?
            <ULink to="/login" class="text-primary font-medium">
              Zaloguj się
            </ULink>
          </div>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
