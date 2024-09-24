import { firestore } from '../utils/config'; // Adjust the path as necessary

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const cartSnapshot = await firestore.collection('cart').get();
            const cartItems = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            res.status(200).json(cartItems);
        } catch (error) {
            console.error('Error fetching cart items: ', error);
            res.status(500).send('Error fetching cart items');
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}