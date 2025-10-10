<script setup lang="ts">
import { updateProfile, updateEmail, updatePassword, type User as FirebaseUser } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const toast = useToast()
const user = useCurrentUser()
const auth = useFirebaseAuth()!
const db = useFirestore()

const userId = route.params.id as string
const dbUser = useUser(userId)

// Profile form state
const profileForm = reactive({
  forename: '',
  surname: '',
  loading: false
})

// Email form state
const emailForm = reactive({
  newEmail: '',
  password: '',
  loading: false
})

// Password form state
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  loading: false
})

// Avatar form state
const avatarForm = reactive({
  avatarUrl: '',
  loading: false
})

// Initialize form data when user data loads
watchEffect(() => {
  if (dbUser.value) {
    profileForm.forename = dbUser.value.forename || ''
    profileForm.surname = dbUser.value.surname || ''
    avatarForm.avatarUrl = dbUser.value.avatarUrl || ''
  }
})

// Update profile (name)
async function updateProfileInfo() {
  if (!user.value || !dbUser.value) return
  
  profileForm.loading = true
  try {
    // Update Firebase Auth display name
    await updateProfile(user.value as FirebaseUser, {
      displayName: `${profileForm.forename} ${profileForm.surname}`
    })
    
    // Update Firestore user document
    const userRef = doc(db, 'users', dbUser.value.id!)
    await updateDoc(userRef, {
      forename: profileForm.forename,
      surname: profileForm.surname,
      updatedAt: new Date().toISOString()
    })
    
    toast.add({ 
      title: 'Sukces', 
      description: 'Profil został zaktualizowany',
      color: 'success'
    })
  } catch (error: any) {
    toast.add({ 
      title: 'Błąd', 
      description: error.message || 'Nie udało się zaktualizować profilu',
      color: 'error'
    })
  } finally {
    profileForm.loading = false
  }
}

// Update email
async function updateUserEmail() {
  if (!user.value || !emailForm.newEmail) return
  
  emailForm.loading = true
  try {
    await updateEmail(user.value as FirebaseUser, emailForm.newEmail)
    
    // Update Firestore
    if (dbUser.value?.id) {
      const userRef = doc(db, 'users', dbUser.value.id)
      await updateDoc(userRef, {
        email: emailForm.newEmail,
        updatedAt: new Date().toISOString()
      })
    }
    
    toast.add({ 
      title: 'Sukces', 
      description: 'Email został zaktualizowany',
      color: 'success'
    })
    emailForm.newEmail = ''
    emailForm.password = ''
  } catch (error: any) {
    let errorMessage = 'Nie udało się zaktualizować emaila'
    if (error.code === 'auth/requires-recent-login') {
      errorMessage = 'Zaloguj się ponownie, aby zmienić email'
    }
    toast.add({ 
      title: 'Błąd', 
      description: errorMessage,
      color: 'error'
    })
  } finally {
    emailForm.loading = false
  }
}

// Update password
async function updateUserPassword() {
  if (!user.value) return
  
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.add({ 
      title: 'Błąd', 
      description: 'Hasła nie są identyczne',
      color: 'error'
    })
    return
  }
  
  if (passwordForm.newPassword.length < 6) {
    toast.add({ 
      title: 'Błąd', 
      description: 'Hasło musi mieć co najmniej 6 znaków',
      color: 'error'
    })
    return
  }
  
  passwordForm.loading = true
  try {
    await updatePassword(user.value as FirebaseUser, passwordForm.newPassword)
    
    toast.add({ 
      title: 'Sukces', 
      description: 'Hasło zostało zmienione',
      color: 'success'
    })
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error: any) {
    let errorMessage = 'Nie udało się zmienić hasła'
    if (error.code === 'auth/requires-recent-login') {
      errorMessage = 'Zaloguj się ponownie, aby zmienić hasło'
    }
    toast.add({ 
      title: 'Błąd', 
      description: errorMessage,
      color: 'error'
    })
  } finally {
    passwordForm.loading = false
  }
}

// Update avatar
async function updateAvatar() {
  if (!user.value || !dbUser.value) return
  
  avatarForm.loading = true
  try {
    // Update Firebase Auth photo URL
    await updateProfile(user.value as FirebaseUser, {
      photoURL: avatarForm.avatarUrl
    })
    
    // Update Firestore
    const userRef = doc(db, 'users', dbUser.value.id!)
    await updateDoc(userRef, {
      avatarUrl: avatarForm.avatarUrl,
      updatedAt: new Date().toISOString()
    })
    
    toast.add({ 
      title: 'Sukces', 
      description: 'Avatar został zaktualizowany',
      color: 'success'
    })
  } catch (error: any) {
    toast.add({ 
      title: 'Błąd', 
      description: error.message || 'Nie udało się zaktualizować avatara',
      color: 'error'
    })
  } finally {
    avatarForm.loading = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="mb-8">
      <h1 class="font-bold text-3xl mb-2">Ustawienia</h1>
      <p class="text-gray-600 dark:text-gray-400">Zarządzaj swoim kontem i preferencjami</p>
    </div>

    <div class="space-y-6">
      <!-- Profile Information Card -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-user" class="w-5 h-5" />
            <h2 class="text-xl font-semibold">Informacje o profilu</h2>
          </div>
        </template>

        <form @submit.prevent="updateProfileInfo" class="space-y-4">
          <UFormGroup label="Imię" required>
            <UInput 
              v-model="profileForm.forename" 
              placeholder="Wprowadź imię"
              icon="i-lucide-user"
              size="lg"
            />
          </UFormGroup>

          <UFormGroup label="Nazwisko" required>
            <UInput 
              v-model="profileForm.surname" 
              placeholder="Wprowadź nazwisko"
              icon="i-lucide-user"
              size="lg"
            />
          </UFormGroup>

          <div class="flex justify-end">
            <UButton 
              type="submit" 
              :loading="profileForm.loading"
              icon="i-lucide-save"
              size="lg"
            >
              Zapisz zmiany
            </UButton>
          </div>
        </form>
      </UCard>

      <!-- Avatar Card -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-image" class="w-5 h-5" />
            <h2 class="text-xl font-semibold">Avatar</h2>
          </div>
        </template>

        <form @submit.prevent="updateAvatar" class="space-y-4">
          <UFormGroup label="URL avatara" helper="Wprowadź link do swojego zdjęcia profilowego">
            <UInput 
              v-model="avatarForm.avatarUrl" 
              placeholder="https://example.com/avatar.jpg"
              icon="i-lucide-link"
              size="lg"
            />
          </UFormGroup>

          <div v-if="avatarForm.avatarUrl" class="flex items-center gap-4">
            <span class="text-sm text-gray-600 dark:text-gray-400">Podgląd:</span>
            <img 
              :src="avatarForm.avatarUrl" 
              alt="Avatar preview" 
              class="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              @error="() => {}"
            />
          </div>

          <div class="flex justify-end">
            <UButton 
              type="submit" 
              :loading="avatarForm.loading"
              icon="i-lucide-save"
              size="lg"
            >
              Zaktualizuj avatar
            </UButton>
          </div>
        </form>
      </UCard>

      <!-- Email Card -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-mail" class="w-5 h-5" />
            <h2 class="text-xl font-semibold">Zmień email</h2>
          </div>
        </template>

        <form @submit.prevent="updateUserEmail" class="space-y-4">
          <UFormGroup label="Obecny email">
            <UInput 
              :model-value="user?.email || ''" 
              disabled
              icon="i-lucide-mail"
              size="lg"
            />
          </UFormGroup>

          <UFormGroup label="Nowy email" required>
            <UInput 
              v-model="emailForm.newEmail" 
              type="email"
              placeholder="nowy@email.com"
              icon="i-lucide-mail"
              size="lg"
            />
          </UFormGroup>

          <UAlert
            icon="i-lucide-info"
            color="info"
            variant="soft"
            title="Informacja"
            description="Po zmianie emaila możesz zostać poproszony o ponowne zalogowanie."
          />

          <div class="flex justify-end">
            <UButton 
              type="submit" 
              :loading="emailForm.loading"
              icon="i-lucide-save"
              size="lg"
            >
              Zmień email
            </UButton>
          </div>
        </form>
      </UCard>

      <!-- Password Card -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-lock" class="w-5 h-5" />
            <h2 class="text-xl font-semibold">Zmień hasło</h2>
          </div>
        </template>

        <form @submit.prevent="updateUserPassword" class="space-y-4">
          <UFormGroup label="Nowe hasło" required>
            <UInput 
              v-model="passwordForm.newPassword" 
              type="password"
              placeholder="Wprowadź nowe hasło"
              icon="i-lucide-lock"
              size="lg"
            />
          </UFormGroup>

          <UFormGroup label="Potwierdź nowe hasło" required>
            <UInput 
              v-model="passwordForm.confirmPassword" 
              type="password"
              placeholder="Potwierdź nowe hasło"
              icon="i-lucide-lock"
              size="lg"
            />
          </UFormGroup>

          <UAlert
            icon="i-lucide-shield"
            color="warning"
            variant="soft"
            title="Wymagania dotyczące hasła"
            description="Hasło musi mieć co najmniej 6 znaków."
          />

          <div class="flex justify-end">
            <UButton 
              type="submit" 
              :loading="passwordForm.loading"
              icon="i-lucide-save"
              size="lg"
            >
              Zmień hasło
            </UButton>
          </div>
        </form>
      </UCard>

      <!-- Account Information Card (Read-only) -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-info" class="w-5 h-5" />
            <h2 class="text-xl font-semibold">Informacje o koncie</h2>
          </div>
        </template>

        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">ID użytkownika</label>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 font-mono">{{ user?.uid }}</p>
          </div>

          <div v-if="dbUser?.createdAt">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Data utworzenia konta</label>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {{ new Date(dbUser.createdAt).toLocaleDateString('pl-PL', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) }}
            </p>
          </div>

          <div v-if="dbUser?.role">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Rola</label>
            <p class="mt-1 text-sm">
              <UBadge :color="dbUser.role === 'admin' ? 'error' : dbUser.role === 'instructor' ? 'info' : 'neutral'">
                {{ dbUser.role === 'admin' ? 'Administrator' : dbUser.role === 'instructor' ? 'Instruktor' : 'Student' }}
              </UBadge>
            </p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>