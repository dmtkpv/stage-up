<script setup>

    import { useState, useErrors } from '#root/global/composables.js'



    // -------------------
    // Options
    // -------------------

    defineOptions({

        preload ({ api }) {
            return {
                ping: api('content-settings').fetch() // check if server alive
            }
        }

    })



    // -------------------
    // Data
    // -------------------

    const state = useState();
    const errors = useErrors();
    state.error = errors.get('INTERNAL_SERVER_ERROR');



</script>