<script setup lang="ts">
import { signInWithEmailAndPassword } from 'firebase/auth'

const auth = useFirebaseAuth()!
const user = useCurrentUser()
const toast = useToast()

const error = ref(null)

function login(email: string, password: string) {
    email = "jan.nowak@gmail.com"
    password = "jan.nowak"


    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            navigateTo('/courses')
            toast.add({ title: 'Sukces', description: 'Zalogowano pomyślnie' })
        })
        .catch((err) => {
            error.value = err
        })
}

const fields: AuthFormField[] = [{
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: '`Podaj swój email`',
    required: true
}, {
    name: 'password',
    label: 'Hasło',
    type: 'password',
    placeholder: '`Podaj swoje hasło`',
    required: true
}, {
    name: 'remember',
    label: '`Zapamiętaj mnie`',
    type: 'checkbox'
}]

</script>

<template>
    <div class="flex flex-col items-center justify-center gap-4 p-4">
        <UPageCard class="w-full max-w-md">
            <UAuthForm :schema="schema" title="Zaloguj się"
                description="Wprowadź dane logowania, aby uzyskać dostęp do swojego konta." icon="i-lucide-user"
                :fields="fields" :providers="providers" :submit="{
                    label: 'Zaloguj się',
                }" @submit="login(fields[0].value, fields[1].value)">
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