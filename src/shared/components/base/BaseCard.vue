<template>
    <div class="base-card">
        <slot />
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.base-card {
    padding: 16px;
    border-radius: 12px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
}
</style>
