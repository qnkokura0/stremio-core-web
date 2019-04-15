import initStateContainer, { ContainerService } from './state_container_web.js';

export function init() {
    return initStateContainer('state_container_web.wasm')
        .then(() => {
            const events = {};
            const containerService = new ContainerService(({ action, args }) => {
                if (Array.isArray(events[action])) {
                    events[action].forEach((listener) => {
                        listener(args);
                    });
                }
            });

            window.stateContainer = Object.freeze({
                on: function(eventName, listener) {
                    events[eventName] = events[eventName] || [];
                    if (events[eventName].indexOf(listener) === -1) {
                        events[eventName].push(listener);
                    }
                },
                off: function(eventName, listener) {
                    if (Array.isArray(events[eventName])) {
                        var listenerIndex = events[eventName].indexOf(listener);
                        if (listenerIndex !== -1) {
                            events[eventName].splice(listenerIndex, 1);
                        }
                    }
                },
                dispatch: function({ action, args }) {
                    containerService.dispatch({ action, args });
                },
                getState: function() {
                    return containerService.get_state();
                }
            });
        });
}