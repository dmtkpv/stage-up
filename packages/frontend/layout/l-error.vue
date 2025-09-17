<!--
    Styles
-->

<style lang="scss">

    .l-error article {

        max-width: 480px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        img {
            max-width: 256px;
            margin-bottom: 48px;
        }

        p {
            margin-top: 8px;
        }

        .ui-button {
            margin-top: 24px;
        }

    }

</style>



<!--
    Template
-->

<template>
    <main class="center l-error">
        <article>
            <img v-if="data.image" :src="data.image">
            <h1 class="h3">{{ data.heading }}</h1>
            <p>{{ data.message }}</p>
            <ui-button v-if="data.button" :text="data.button.text" @click="data.button.click" />
        </article>
    </main>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { useText, useMeta, useErrors } from '#root/global/composables.js'
    import { UiButton } from '#root/global/components.js'

    const props = defineProps(['value'])
    const router = useRouter();
    const errors = useErrors();
    const t = useText('l-error');



    // -------------------
    // Buttons
    // -------------------

    const buttons = {

        home: {
            text: t('HOME_BUTTON'),
            click: () => router.push({ name: 'home' })
        },

        reload: {
            text: t('RELOAD_BUTTON'),
            click: () => window.location.reload()
        }

    }



    // -------------------
    // Defaults
    // -------------------

    const defaults = {

        NOT_FOUND: {
            heading: t('NOT_FOUND_HEADING'),
            message: t('NOT_FOUND_MESSAGE'),
            button: buttons.home
        },

        DEPRECATED: {
            image: false,
            heading: t('DEPRECATED_HEADING'),
            button: false
        },

        FORBIDDEN: {
            image: '/illustrations/forbidden.svg',
            heading: t('FORBIDDEN_HEADING'),
            button: buttons.home
        }

    }



    // -------------------
    // Data
    // -------------------

    const data = computed(() => {
        return Object.assign({
            image: '/illustrations/error.svg',
            heading: t('DEFAULT_HEADING'),
            message: errors.message(props.value),
            button: buttons.reload
        }, defaults[props.value.code])
    })




    // -------------------
    // Meta
    // -------------------

    useMeta(null, {
        title: t(data.value.heading)
    })



</script>