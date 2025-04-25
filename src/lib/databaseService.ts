import { db as firestore } from './firebase';
import { pool as mysqlPool } from './mysql';
import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';

export class DatabaseService {
  // Determine which database to use for specific operations
  private static shouldUseFirebase(operation: string, dataType: string): boolean {
    // Add your logic here to determine which database to use
    // Example: Use Firebase for real-time data and user-related operations
    // Use MySQL for structured, relational data and analytics
    const firebaseOperations = ['user-data', 'real-time-updates', 'authentication'];
    return firebaseOperations.includes(dataType);
  }

  // Generic create operation
  static async create(collection: string, data: any, dataType: string = 'default') {
    try {
      if (this.shouldUseFirebase(operation, dataType)) {
        const docRef = await addDoc(collection(firestore, collection), data);
        return { id: docRef.id, ...data };
      } else {
        const [result] = await mysqlPool.execute(
          `INSERT INTO ${collection} SET ?`,
          [data]
        );
        return { id: result.insertId, ...data };
      }
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  // Generic read operation
  static async read(collection: string, id: string, dataType: string = 'default') {
    try {
      if (this.shouldUseFirebase(operation, dataType)) {
        const docRef = doc(firestore, collection, id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
      } else {
        const [rows] = await mysqlPool.execute(
          `SELECT * FROM ${collection} WHERE id = ?`,
          [id]
        );
        return rows[0] || null;
      }
    } catch (error) {
      console.error('Error reading document:', error);
      throw error;
    }
  }

  // Generic update operation
  static async update(collection: string, id: string, data: any, dataType: string = 'default') {
    try {
      if (this.shouldUseFirebase(operation, dataType)) {
        const docRef = doc(firestore, collection, id);
        await updateDoc(docRef, data);
        return { id, ...data };
      } else {
        await mysqlPool.execute(
          `UPDATE ${collection} SET ? WHERE id = ?`,
          [data, id]
        );
        return { id, ...data };
      }
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  // Generic delete operation
  static async delete(collection: string, id: string, dataType: string = 'default') {
    try {
      if (this.shouldUseFirebase(operation, dataType)) {
        const docRef = doc(firestore, collection, id);
        await deleteDoc(docRef);
        return true;
      } else {
        await mysqlPool.execute(
          `DELETE FROM ${collection} WHERE id = ?`,
          [id]
        );
        return true;
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Query operation (with basic filtering)
  static async query(collection: string, filters: any, dataType: string = 'default') {
    try {
      if (this.shouldUseFirebase(operation, dataType)) {
        const q = query(
          collection(firestore, collection),
          ...Object.entries(filters).map(([field, value]) => where(field, '==', value))
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } else {
        const whereClause = Object.entries(filters)
          .map(([field]) => `${field} = ?`)
          .join(' AND ');
        const values = Object.values(filters);
        
        const [rows] = await mysqlPool.execute(
          `SELECT * FROM ${collection} ${whereClause ? `WHERE ${whereClause}` : ''}`,
          values
        );
        return rows;
      }
    } catch (error) {
      console.error('Error querying documents:', error);
      throw error;
    }
  }
} 