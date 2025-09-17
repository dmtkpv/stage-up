import io from 'socket.io-client'
import { getCurrentInstance, onUnmounted } from 'vue'

export default function ({ ssr }) {



    // -------------------
    // SSR
    // -------------------

    if (ssr) return new Proxy({}, {
        get: () => () => {}
    })



    // -------------------
    // Common
    // -------------------

    const emitter = new EventTarget();

    const socket = io(BACKEND_URL, {
        autoConnect: false
    });

    socket.on('connect', () => {
        if (!socket.restoring) return;
        socket.restoring = false;
        emitter.dispatchEvent(new Event('restore'));
    });



    // -------------------
    // Methods
    // -------------------

    function connect (token) {
        socket.io.opts.query = { token };
        socket.connect();
    }

    function restore (token) {
        if (socket.connected) return;
        socket.restoring = true;
        connect(token);
    }

    function disconnect () {
        socket.disconnect();
    }

    function emit (event, data) {
        socket.emit(event, data);
    }

    function on (event, callback) {
        if (event === 'restore') emitter.addEventListener('restore', callback);
        else socket.on(event, callback);
        getCurrentInstance() && onUnmounted(() => {
            if (event === 'restore') emitter.removeEventListener('restore', callback);
            else socket.off(event, callback);
        })
    }



    // -------------------
    // Exports
    // -------------------

    return {
        socket,
        connect,
        restore,
        disconnect,
        emit,
        on
    }



}