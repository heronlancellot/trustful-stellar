import { NextApiRequest, NextApiResponse } from 'next';
import { communitiesData } from "@/lib/utils/mock/communitiesAll"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const community = communitiesData;
        res.status(200).json(community);
    } else if (req.method === 'POST') {
        const newCommunity = req.body;
        newCommunity.id = Date.now();
        res.status(201).json(newCommunity);
    } else {
        res.status(405).end();
    }
}