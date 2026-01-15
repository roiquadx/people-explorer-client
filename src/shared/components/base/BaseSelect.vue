<template>
    <label class="base-select">
        <span v-if="label" class="base-select__label">{{ label }}</span>

        <select :value="modelValue" :disabled="disabled" @change="onChange">
            <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.label }}
            </option>
        </select>
    </label>
</template>

<script setup lang="ts">
export type SelectOption = {
    label: string;
    value: string;
};

const props = defineProps<{
    modelValue: string;
    options: SelectOption[];
    label?: string;
    disabled?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

function onChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    emit('update:modelValue', target.value);
}
</script>

<style scoped lang="scss">
.base-select {
    display: grid;
    gap: 6px;

    select {
        padding: 10px;
        border-radius: 8px;
        border: 1px solid var(--color-border);
    }

    &__label {
        font-size: 13px;
        font-weight: 600;
    }
}
</style>
