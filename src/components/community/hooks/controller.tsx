'use client'

import { Communities } from "@/types/communities";
import { useEffect, useState } from "react";

export default function useCommunitiesController() {
    const [communities, setCommunities] = useState<Communities[]>([])

    useEffect(() => {
        const getCommunities = async () => {
            try {
                const response = await fetch(`https://trustful-stellar-backend-production.up.railway.app/communities`);
                const data = await response.json();

                setCommunities(data)

            } catch (error) {
                console.error(error);
            }
        };

        getCommunities()
    }, [])

    return {
        communities,
        setCommunities
    }
}