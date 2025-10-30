<script setup lang="ts">
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import type { FormSubmitEvent } from '@nuxt/ui'

const auth = useFirebaseAuth()!
const user = useCurrentUser()
const toast = useToast()

const error = ref(null)
const loading = ref(false)
const showReset = ref(false)
const resetEmail = ref('')
const resetEmailError = ref('')

async function onSubmit(event: FormSubmitEvent<any>) {
    loading.value = true
    console.log('Logging in with', event.data.email, event.data.password)
    try {
        await signInWithEmailAndPassword(auth, event.data.email, event.data.password)
        navigateTo('/courses')
        toast.add({
            title: 'Sukces',
            description: 'Zalogowano pomyślnie',
            color: 'success',
            icon: 'i-lucide-user'
        })
    } catch (err: any) {
        // Log Firebase error to console
        console.error('Firebase login error:', err)
        
        // Map Firebase error codes to Polish messages
        let polishMessage = 'Nie udało się zalogować. Sprawdź dane i spróbuj ponownie.'
        
        if (err?.code) {
            switch (err.code) {
                case 'auth/invalid-email':
                    polishMessage = 'Podany adres email jest nieprawidłowy.'
                    break
                case 'auth/user-disabled':
                    polishMessage = 'To konto zostało wyłączone.'
                    break
                case 'auth/user-not-found':
                    polishMessage = 'Nie znaleziono użytkownika z tym adresem email.'
                    break
                case 'auth/wrong-password':
                    polishMessage = 'Nieprawidłowe hasło.'
                    break
                case 'auth/invalid-credential':
                    polishMessage = 'Nieprawidłowy email lub hasło.'
                    break
                case 'auth/too-many-requests':
                    polishMessage = 'Zbyt wiele nieudanych prób logowania. Spróbuj ponownie później.'
                    break
                case 'auth/network-request-failed':
                    polishMessage = 'Błąd połączenia sieciowego. Sprawdź swoje połączenie z internetem.'
                    break
                default:
                    polishMessage = 'Nie udało się zalogować. Sprawdź dane i spróbuj ponownie.'
            }
        }
        
        error.value = err
        toast.add({
            title: 'Błąd logowania',
            description: polishMessage,
            color: 'error',
            icon: 'i-lucide-alert-circle'
        })
    } finally {
        loading.value = false
    }
}

const fields = [{
    name: 'email',
    type: 'email' as const,
    label: 'Email',
    placeholder: '`Podaj swój email`',
    required: true
}, {
    name: 'password',
    label: 'Hasło',
    type: 'password' as const,
    placeholder: '`Podaj swoje hasło`',
    required: true
}, {
    name: 'remember',
    label: 'Zapamiętaj mnie',
    type: 'checkbox' as const
}]

function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

async function handleForgotPasswordClick() {
    // Prefill with email from login form if available
    const inputEl = document.querySelector('input[name="email"]') as HTMLInputElement | null
    const candidate = inputEl?.value?.trim() || ''
    resetEmail.value = candidate
    resetEmailError.value = ''
    showReset.value = true
}

async function sendReset() {
    const email = resetEmail.value?.trim()
    
    // Clear previous error
    resetEmailError.value = ''
    
    if (!email) {
        resetEmailError.value = 'Podaj adres email'
        return
    }
    
    if (!validateEmail(email)) {
        resetEmailError.value = 'Podaj prawidłowy adres email'
        return
    }
    
    try {
        await sendPasswordResetEmail(auth, email)
        toast.add({
            title: 'Wysłano link',
            description: 'Sprawdź swoją skrzynkę pocztową, aby zresetować hasło.',
            color: 'success',
            icon: 'i-lucide-mail'
        })
        showReset.value = false
        resetEmail.value = ''
    } catch (err: any) {
        toast.add({
            title: 'Nie udało się wysłać',
            description: err?.message || 'Wystąpił problem podczas wysyłania linku resetującego.',
            color: 'error',
            icon: 'i-lucide-x'
        })
    }
}

</script>

<template>
    <div class="flex flex-col items-center justify-center gap-4 p-4">
        <UPageCard class="w-full max-w-md backdrop-blur-sm shadow-md">
            <UAuthForm title="Zaloguj się" description="Wprowadź dane logowania, aby uzyskać dostęp do swojego konta."
            icon="i-lucide-user" :fields="fields" :submit="{
                label: 'Zaloguj się',
            }" :loading="loading" @submit="onSubmit">
            <template #footer>
                <div class="flex flex-col gap-2 text-sm">
                <div class="text-center">
                    <!-- Reset Password Modal -->
                    <UModal v-model:open="showReset" title="Reset hasła"
                    description="Wpisz adres email powiązany z Twoim kontem. Wyślemy link do zresetowania hasła."
                    :ui="{ footer: 'justify-end' }">
                    <UButton color="neutral" size="xs" variant="link" @click="handleForgotPasswordClick">
                        Nie pamiętasz hasła?
                    </UButton>

                    <template #body>
                        <UFormField 
                        label="Email" 
                        :error="resetEmailError"
                        required>
                        <UInput 
                            v-model="resetEmail" 
                            type="email" 
                            placeholder="Podaj swój adres email"
                            icon="i-lucide-mail" 
                            size="md"
                            @blur="() => {
                            if (resetEmail && !validateEmail(resetEmail)) {
                                resetEmailError = 'Podaj prawidłowy adres email'
                            } else {
                                resetEmailError = ''
                            }
                            }"
                            @input="() => resetEmailError = ''" />
                        </UFormField>
                    </template>

                    <template #footer="{ close }">
                        <div class="flex justify-end gap-2">
                        <UButton 
                            color="neutral" 
                            variant="outline"
                            @click="close">
                            Anuluj
                        </UButton>
                        <UButton 
                            color="primary"
                            @click="sendReset">
                            Wyślij link
                        </UButton>
                        </div>
                    </template>

                    </UModal>
                </div>
                <div class="text-center text-muted">
                    Nie masz jeszcze konta?
                    <ULink to="/register" class="text-primary font-medium">
                    Zarejestruj się
                    </ULink>
                </div>
                </div>
            </template>
            </UAuthForm>
        </UPageCard>


    </div>
</template>