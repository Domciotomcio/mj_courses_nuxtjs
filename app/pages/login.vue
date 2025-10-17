<script setup lang="ts">
import { signInWithEmailAndPassword } from 'firebase/auth'
import type { FormSubmitEvent } from '@nuxt/ui'

const auth = useFirebaseAuth()!
const user = useCurrentUser()
const toast = useToast()

const error = ref(null)
const loading = ref(false)

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
        error.value = err
        toast.add({
            title: 'Błąd logowania',
            description: err?.message || 'Nie udało się zalogować. Sprawdź dane i spróbuj ponownie.',
            color: 'error',
            icon: 'i-lucide-user'
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

</script>

<template>
    <div class="flex flex-col items-center justify-center gap-4 p-4">
        <UPageCard class="w-full max-w-md">
            <UAuthForm title="Zaloguj się"
                description="Wprowadź dane logowania, aby uzyskać dostęp do swojego konta." icon="i-lucide-user"
                :fields="fields" :submit="{
                    label: 'Zaloguj się',
                }" :loading="loading" @submit="onSubmit">
                <template #footer>
                    <div class="text-center text-sm text-muted">
                        Nie masz jeszcze konta?
                        <ULink to="/register" class="text-primary font-medium">
                            Zarejestruj się
                        </ULink>
                    </div>
                </template>
            </UAuthForm>
        </UPageCard>
    </div>
</template>