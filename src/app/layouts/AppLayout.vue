<template>
    <div class="app">
        <AppHeader />

        <main class="app__main">
            <RouterView v-slot="{ Component }">
                <Transition name="route-fade" mode="out-in">
                    <component :is="Component" />
                </Transition>
            </RouterView>
        </main>
    </div>
</template>

<script setup lang="ts">
import AppHeader from '@/app/components/AppHeader.vue';
</script>

<style scoped lang="scss">
.app {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;

    &__main {
        flex: 1;
        padding: 24px;
    }
}

.route-fade-enter-active,
.route-fade-leave-active {
    transition:
        opacity 160ms ease,
        transform 160ms ease;
}
.route-fade-enter-from,
.route-fade-leave-to {
    opacity: 0;
    transform: translateY(2px);
}
</style>
