<!--
    Styles
-->

<style lang="scss">

</style>



<!--
    Template
-->

<template>
    <m-default class="auth" :title="t('HEADING')">

        <l-form
            :button="t('BUTTON')"
            :value="data"
            :form="form"
            :error="error"
            :loading="login.pending"
            @submit="login.quiet('email', data)"
        />

        <footer>
            <span>{{ t('FOOTER') }}&nbsp;</span>
            <a class="link" @click="click('auth-register')">{{ t('REGISTER') }}</a>
        </footer>

    </m-default>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, reactive } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { useAPI, useAuthClick, useText, useModal, useMeta, useUser, useIsAuthPage } from '#root/global/composables.js'
    import { MDefault, LForm } from '#root/global/components.js'
    import { useFormLogin } from '#root/global/forms.js'



    // -------------------
    // Data
    // -------------------

    const t = useText('route-auth-login');
    const click = useAuthClick()
    const form = useFormLogin({ t, restore: () => click('auth-reset') });
    const route = useRoute();
    const router = useRouter();
    const page = useIsAuthPage();
    const modal = useModal();
    const user = useUser();
    const login = useAPI('auth-login');
    const error = ref(null);

    const data = reactive({
        email: '',
        password: ''
    })



    // -------------------
    // Hooks
    // -------------------

    login.onSuccess(() => {
        if (page.value && route.query.from) return router.push(route.query.from);
        if (user.role !== 'candidate') return router.push({ name: 'account-dashboard' });
        if (page.value) return router.push({ name: 'jobs' });
        else return router.push({ query: { ...route.query, t: Date.now() } });
    })

    login.onError(err => {
        if (err.code === 'UNVERIFIED') {
            if (page.value) router.push({ name: 'auth-verify', query: err.data });
            else modal.show('auth-verify', err.data);
        }
        else error.value = err;
    })

    page.value && useMeta()



</script>