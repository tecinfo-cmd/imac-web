import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";

export function useAdequancyTerm(options: any = {}) {
    return useMutation<any, any, { id: number }>({
        mutationFn: async ({ id }) => {
            const { data } = await api.post(`propriedade-prem/${id}/aceitar-termo-adequacao`);
            return data;
        },
        ...options,
    });
}