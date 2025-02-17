'use client'

import { BadgesList, Communities, MembersList } from "@/types/communities";
import { useEffect, useState } from "react";

export default function useCommunitiesController() {
    const [communities, setCommunities] = useState<Communities[]>([])
    const [communitiesDetail, setCommunitiesDetail] = useState<Communities>()
    const [communitiesBadgesList, setCommunitiesBadgesList] = useState<BadgesList[]>()
    const [communitiesMembersList, setCommunitiesMembersList] = useState<MembersList[]>()
    const [inputText, setInputText] = useState("");


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

    const getCommunitiesDetails = async (communityAdress: string) => {
        try {
            const response = await fetch(`https://trustful-stellar-backend-production.up.railway.app/communities/${communityAdress}`);
            const data = await response.json();
            console.log(data);

            setCommunitiesDetail(data)

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

    const getCommunitiesBadgesList = async (communityAddress: string) => {
        try {
            const response = await fetch(`https://trustful-stellar-backend-production.up.railway.app/communities/${communityAddress}/badges`);
            const data = await response.json();
            console.log(data);

            setCommunitiesBadgesList(data)

        } catch (error) {
            console.error(error);
        }
    };

    const getCommunitiesMembersList = async (communityAddress: string) => {
        try {
            const response = await fetch(`https://trustful-stellar-backend-production.up.railway.app/communities/${communityAddress}/members`);
            const data = await response.json();
            console.log(data);

            setCommunitiesMembersList(data)

        } catch (error) {
            console.error(error);
        }
    };


    return {
        communities,
        setCommunities,
        getCommunitiesSpec,
        refetchCommunitiesAll,
        getCommunitiesDetails,
        getCommunitiesBadgesList,
        getCommunitiesMembersList,
        communitiesBadgesList,
        setCommunitiesBadgesList,
        communitiesMembersList,
        setCommunitiesMembersList,
        communitiesDetail,
        setCommunitiesDetail,
        inputText,
        setInputText
    }
}