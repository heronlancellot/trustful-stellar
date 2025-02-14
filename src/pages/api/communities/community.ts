import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await fetch('https://trustful-stellar-backend-production.up.railway.app/communities')
        const data = await response.json()
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error })
    }
}