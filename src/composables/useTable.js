import { ref, watch } from "vue";

export default function useTable(config, fetchCallback) {
    const search = ref(config.search ?? "");
    const entries = ref(config.entries ?? 10);
    const filters = ref(config.filters ?? {});

    let timeout = null;

    // Saat search berubah, tunggu 500ms lalu fetch API
    watch(search, () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (fetchCallback) fetchCallback();
        }, 500);
    });

    // Saat entries atau filter berubah, langsung fetch API
    watch(entries, () => {
        if (fetchCallback) fetchCallback();
    });

    watch(
        filters,
        () => {
            if (fetchCallback) fetchCallback();
        },
        { deep: true }
    );

    return {
        search,
        entries,
        filters,
    };
}