<!--
    Styles
-->

<style lang="scss">

    .ds0HqR._disabled {
        pointer-events: none;
        color: $grey-dark;
    }

</style>



<!--
    Template
-->

<template>
    <m-default class="auth" font="4" :close="false" :title="t('HEADING')">

        <l-form
            :button="t('BUTTON')"
            :value="edits"
            :form="form"
            :error="login.error"
            :loading="login.pending"
            @submit="login.quiet('code', edits)"
        />

        <footer>
            <p v-if="resend.data">{{ t('RESEND_SUCCESS') }}</p>
            <template v-else>
                <span>{{ t('RESEND_NOTE') }}&nbsp;</span>
                <a class="link ds0HqR" @click="resend.quiet(edits.token)" :class="{ _disabled: resend.pending }">{{ t('RESEND') }}</a>
            </template>
        </footer>

        <ui-error v-if="resend.error" :value="resend.error" />

    </m-default>
</template>



<!--
    Scripts
-->

<script setup>

    import { reactive } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { useAPI, useAuthClick, useText, useMeta, useModal, useUser, useIsAuthPage } from '#root/global/composables.js'
    import { MDefault, LForm, UiError } from '#root/global/components.js'
    import { useFormVerify } from '#root/global/forms.js'

    const t = useText('route-auth-verify');

    const props = defineProps([
        'token'
    ])

    const page = useIsAuthPage();
    const click = useAuthClick()
    const route = useRoute();
    const router = useRouter();
    const modal = useModal();
    const user = useUser();
    const form = useFormVerify({ t });
    const login = useAPI('auth-login');
    const resend = useAPI('auth-verify-resend');

    const edits = reactive({
        token: page.value ? route.query.token : props.token
    })

    login.onSuccess(() => {
        if (user.role === 'company') return router.push({ name: 'account-company' });
        else return router.push({ name: 'account-profile' });
    })

    resend.onSuccess(data => {
        edits.token = data.token;
    })

    page.value && useMeta()

</script>