<!--
    Styles
-->

<style lang="scss">

    .l-header_language {

        display: flex;
        align-items: center;

        span {
            text-transform: uppercase;
        }

        svg {
            margin-left: 6px;
        }

    }

</style>



<!--
    Template
-->

<template>
    <div class="l-header_menu">

        <button class="l-header_language" @click="overlay = !overlay">
            <span>{{ locale }}</span>
            <ui-icon :value="IconSmDown" />
        </button>

        <ui-tooltip v-model="overlay">
            <ui-item
                v-for="{ value, text } in languages"
                :text="t(text)"
                :active="value === locale"
                :disabled="disabled"
                @click="change(value)"
            />
        </ui-tooltip>

    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref } from 'vue'
    import { useRoute } from 'vue-router'
    import { useText, useState, useAPI, toastAPIError } from '#root/global/composables.js'
    import { UiIcon, UiTooltip, UiItem } from '#root/global/components.js'
    import { IconSmDown } from '#root/global/icons.js'

    const t = useText('l-header');
    const { locale } = useState();
    const url = useAPI('content-url');
    const route = useRoute();
    const disabled = ref(false);
    const overlay = ref(false);

    const languages = [
        { value: 'nl', text: 'DUTCH' },
        { value: 'en', text: 'ENGLISH' },
    ]

    function change (locale) {
        const { name, params, query, fullPath } = route;
        disabled.value = true
        if (name) url.fetch({ locale, name, params, query });
        else window.location.href = (locale === 'nl' ? '' : '/en') + fullPath;
    }

    url.onSuccess(data => {
        window.location.href = data.url;
    })

    url.onError(() => {
        disabled.value = false
    })

    toastAPIError(url);

</script>