import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Crea una transacción de compra en Firestore.
 * @param {import('firebase/firestore').Firestore} db - Instancia de Firestore
 * @param {string} userId - UID del usuario autenticado
 * @param {string} userEmail - Email del usuario al momento de la compra
 * @param {Array} items - Items del carrito con { id, title, price, image, quantity }
 * @param {number} total - Monto total de la compra
 * @returns {Promise<import('firebase/firestore').DocumentReference>}
 * @throws {Error} Si el carrito está vacío
 */
export const createTransaction = async (db, userId, userEmail, items, total) => {
  if (!items || items.length === 0) {
    throw new Error('El carrito está vacío');
  }

  const transaction = {
    items: items.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: item.quantity
    })),
    total,
    status: 'completada',
    userId,
    userEmail,
    createdAt: serverTimestamp()
  };

  return addDoc(collection(db, 'transacciones'), transaction);
};
