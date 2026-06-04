import connectToDatabase from '@/Data/mongodb'
import DestinationModel from '@/Data/models/Destination'
import type { Destination } from '@/Data/types'

const initialDestinations: Partial<Destination>[] = [
    {
        title: 'Rajwada Palace',
        description: 'Historic royal palace with stunning Indo-Saracenic architecture. Built by the Holkars of the Maratha Empire, this seven-story palace is a blend of Maratha, Mughal, and French styles, standing as an iconic heritage landmark in the heart of Indore.',
        category: 'heritage',
        images: [
            'https://images.unsplash.com/photo-1721572321875-2610e9e83d55?w=1080',
            'https://images.unsplash.com/photo-1627483262112-039e9a0a40d8?w=1080'
        ],
        rating: 4.8,
        reviewsCount: 2543,
        location: 'Rajwada, Indore',
        latitude: 22.7187,
        longitude: 75.8578,
        openingHours: '10:00 AM - 05:00 PM (Monday Closed)',
        ticketPrice: 20,
        active: true
    },
    {
        title: 'Chappan Dukan',
        description: 'Indore\'s legendary food street hosting 56 distinct shops offering local and modern street food. It is globally recognized for hygiene and is a clean-street-food hub where you can taste Indori Poha, Jalebi, Egg Banjo, and unique sweets.',
        category: 'food',
        images: [
            'https://images.unsplash.com/photo-1772460759097-ad68b3232a4f?w=1080',
            'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=1080'
        ],
        rating: 4.7,
        reviewsCount: 3142,
        location: 'New Palasia, Indore',
        latitude: 22.7244,
        longitude: 75.8839,
        openingHours: '08:00 AM - 11:00 PM',
        ticketPrice: 0,
        active: true
    },
    {
        title: 'Khajrana Ganesh Temple',
        description: 'Revered spiritual temple built by Rani Ahilyabai Holkar in 1735. It is dedicated to Lord Ganesha, and is believed that all wishes made here are fulfilled. The temple complex is beautiful and calm, perfect for meditation and worship.',
        category: 'spiritual',
        images: [
            'https://images.unsplash.com/photo-1698153210197-5a1027c6c5e8?w=1080',
            'https://images.unsplash.com/photo-1609137144814-7d52a2336336?w=1080'
        ],
        rating: 4.9,
        reviewsCount: 4287,
        location: 'Khajrana, Indore',
        latitude: 22.7303,
        longitude: 75.9015,
        openingHours: '05:00 AM - 11:00 PM',
        ticketPrice: 0,
        active: true
    },
    {
        title: 'Lal Bagh Palace',
        description: 'One of the grandest monuments of the Holkar dynasty. This grand palace spreads across 28 acres and features European-style interiors, Italian marble columns, Persian carpets, and massive gates modeled after London\'s Buckingham Palace.',
        category: 'heritage',
        images: [
            'https://images.unsplash.com/photo-1599830800618-cb94d75fb080?w=1080',
            'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1080'
        ],
        rating: 4.5,
        reviewsCount: 1820,
        location: 'Lalbagh Road, Indore',
        latitude: 22.7001,
        longitude: 75.8423,
        openingHours: '10:00 AM - 05:00 PM (Monday Closed)',
        ticketPrice: 50,
        active: true
    },
    {
        title: 'Patalpani Waterfall',
        description: 'A breathtaking 300-foot-tall waterfall surrounded by lush green hills. A highly popular weekend picnic spot, the valley looks incredibly beautiful during the monsoon season. Legend says the pit below goes deep into patal (netherworld).',
        category: 'nature',
        images: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1080'
        ],
        rating: 4.4,
        reviewsCount: 1540,
        location: 'Mhow Tehsil, Indore District',
        latitude: 22.4939,
        longitude: 75.7958,
        openingHours: '06:00 AM - 06:00 PM',
        ticketPrice: 0,
        active: true
    }
]

export async function seedInitialDestinations() {
    await connectToDatabase()

    const operations = initialDestinations.map((destination) => ({
        updateOne: {
            filter: { title: destination.title },
            update: { $set: destination },
            upsert: true
        }
    }))

    const result = await DestinationModel.bulkWrite(operations)

    return {
        matched: result.matchedCount,
        modified: result.modifiedCount,
        inserted: result.upsertedCount,
        totalInput: initialDestinations.length
    }
}

export async function clearSeededDestinations() {
    await connectToDatabase()
    const result = await DestinationModel.deleteMany({})
    return {
        deleted: result.deletedCount
    }
}
