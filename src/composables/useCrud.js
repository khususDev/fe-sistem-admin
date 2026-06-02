import { ref } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";

export default function useCrud(config) {
    const showModal = ref(false);
    const showDeleteModal = ref(false);
    const isEdit = ref(false);
    const selectedId = ref(null);
    const loading = ref(false);
    
    // Mengganti useForm Inertia dengan ref biasa
    const form = ref({ ...config.initialForm });
    // State khusus untuk menampung error validasi (422) dari Laravel
    const errors = ref({}); 

    const openCreate = () => {
        isEdit.value = false;
        errors.value = {};
        form.value = { ...config.initialForm };
        showModal.value = true;
    };

    const openEdit = (data) => {
        isEdit.value = true;
        errors.value = {};
        selectedId.value = data.id;
        
        // Copy data ke form
        Object.keys(config.initialForm).forEach((key) => {
            form.value[key] = data[key];
        });
        showModal.value = true;
    };

    const closeModal = () => {
        showModal.value = false;
        errors.value = {};
    };

    const submit = async (onSuccessCallback) => {
        loading.value = true;
        errors.value = {}; 

        try {
            if (isEdit.value) {
                // TAMBAHKAN 'const res =' DI SINI
                const res = await axios.put(`${config.updateRoute}/${selectedId.value}`, form.value);
                toast.success(res?.data?.message || "Data updated successfully!");
            } else {
                // TAMBAHKAN 'const res =' DI SINI
                const res = await axios.post(config.storeRoute, form.value);
                toast.success(res?.data?.message || "Data saved successfully!");
            }
            
            closeModal();
            if (onSuccessCallback) onSuccessCallback(); 
            
        } catch (err) {
            if (err.response && err.response.status === 422) {
                errors.value = err.response.data.errors;
                toast.error("Please check your input fields.");
            } else {
                console.error("Gagal menyimpan:", err);
                toast.error("A system error occurred. Please try again later.");
            }
        } finally {
            loading.value = false;
        }
    };

    // Fungsi Confirm Delete
    const confirmDelete = async (onSuccessCallback) => {
        try {
            // TAMBAHKAN 'const res =' DI SINI
            const res = await axios.delete(`${config.deleteRoute}/${selectedId.value}`);
            closeDeleteModal();
            if (onSuccessCallback) onSuccessCallback();
            
            toast.success(res?.data?.message || "Data deleted successfully!");
        } catch (err) {
            console.error("Failed to delete data:", err);
            toast.error("Failed to delete data.");
        }
    };

    const openDelete = (id) => {
        selectedId.value = id;
        showDeleteModal.value = true;
    };

    const closeDeleteModal = () => {
        showDeleteModal.value = false;
    };

    // const confirmDelete = async (onSuccessCallback) => {
    //     try {
    //         await axios.delete(`${config.deleteRoute}/${selectedId.value}`);
    //         closeDeleteModal();
    //         if (onSuccessCallback) onSuccessCallback();
    //         toast.success(res.data.message || "Data berhasil dihapus!");
    //     } catch (err) {
    //         console.error("Gagal menghapus:", err);
    //         toast.error("Data gagal dihapus.");
    //     }
    // };

    return {
        form,
        errors, // Return errors agar bisa dibaca di FormInput
        showModal,
        showDeleteModal,
        isEdit,
        loading,
        openCreate,
        openEdit,
        closeModal,
        submit,
        openDelete,
        closeDeleteModal,
        confirmDelete,
    };
}