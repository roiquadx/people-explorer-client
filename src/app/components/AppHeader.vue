<template>
    <header class="header">
        <div class="header__brand">
            <RouterLink to="/" class="header__title">People Explorer</RouterLink>
        </div>

        <nav class="header__nav">
            <RouterLink to="/" class="header__link">Home</RouterLink>
            <RouterLink to="/random" class="header__link">Random</RouterLink>
            <RouterLink to="/history" class="header__link">History</RouterLink>
        </nav>
    </header>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    background: #fff;

    &__brand {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    &__title {
        text-decoration: none;
        font-weight: 650;
        letter-spacing: -0.01em;
    }

    &__nav {
        display: flex;
        gap: 12px;
    }

    &__link {
        color: inherit;
        text-decoration: none;
        opacity: 0.8;

        &.router-link-active {
            opacity: 1;
            font-weight: 600;
        }
    }
}
</style>
