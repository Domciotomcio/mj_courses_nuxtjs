<script lang="ts" setup>
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'

const auth = useFirebaseAuth()!
const user = useCurrentUser()

const error = ref(null)

function login(email: string, password: string) {
  signInWithEmailAndPassword(auth, email, password).catch((err) => {
    error.value = err
  })
}

function logout() {
  signOut(auth)
}

</script>

<template>
  <div>
    Login page

    <p>User = {{ user }}</p>

    <template v-if="user === undefined">
      Loading...
    </template>

    <template v-else-if="user === null">
      Not logged in
    </template>

    <template v-else>
      Logged in as {{ user.email }}
    </template>

    <main>
    <ErrorBox v-if="error" :error="error" />
    <button @click="login('jan.nowak@gmail.com', 'jan.nowak')">SignIn with Google</button>
    </main>

    <button @click="logout()">Sign Out</button>


  </div>
</template>
