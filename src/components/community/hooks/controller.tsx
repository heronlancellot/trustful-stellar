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


    const getCommunitiesSpec = async (status: string) => {
        try {
            const response = await fetch(`https://trustful-stellar-backend-production.up.railway.app/communities/${status}/GD7IDV44QE7CN35M2QLSAISAYPSOSSZTV7LWMKBU5PKDS7NQKTFRZUTS`);
            const data = await response.json();
            console.log(data);

            setCommunities(data)

        } catch (error) {
            console.error(error);
        }
    };

    const refetchCommunitiesAll = async () => {
        try {
            const response = await fetch(`https://trustful-stellar-backend-production.up.railway.app/communities`);
            const data = await response.json();
            console.log(data);

            setCommunities(data)

        } catch (error) {
            console.error(error);
        }
    };


    return {
        communities,
        setCommunities,
        getCommunitiesSpec,
        refetchCommunitiesAll
    }
}