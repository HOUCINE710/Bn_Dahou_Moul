import React, { createContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { collection, onSnapshot, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { User, UserRole, Equipment, EquipmentStatus, Rental, ActivityLog, ActivityType } from '../types';
import { INITIAL_USERS, INITIAL_EQUIPMENT } from '../constants';

// Fix: Export AppContext to be used in useAppContext hook.
export const AppContext = createContext<AppContextType | undefined>(undefined);

export interface AppContextType {
  currentUser: User | null;
  users: User[];
  equipment: Equipment[];
  rentals: Rental[];
  activityLog: ActivityLog[];
  login: (username: string, password_param: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: Omit<User, 'id' | 'role'>) => Promise<void>;
  addEquipment: (eq: Omit<Equipment, 'id' | 'status' | 'serviceEntryDate' | 'totalRevenue'>) => Promise<void>;
  updateEquipment: (id: string, updates: Partial<Omit<Equipment, 'id' | 'serviceEntryDate' | 'totalRevenue'>>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  rentEquipment: (rentalData: Omit<Rental, 'id' | 'startTime' | 'workerId' | 'workerUsername' | 'equipmentName'>) => Promise<void>;
  returnEquipment: (equipmentId: string) => Promise<void>;
}

interface AppProviderProps {
  children: ReactNode;
}

// Helper to convert Firestore timestamps to Dates
const convertTimestampsToDates = (data: any) => {
    for (const key in data) {
        if (data[key] instanceof Timestamp) {
            data[key] = data[key].toDate();
        }
    }
    return data;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);

  // Seed database on first load if it's empty
  useEffect(() => {
    const seedDatabase = async () => {
      try {
        const usersQuery = query(collection(db, "users"));
        const usersSnapshot = await getDocs(usersQuery);
        if (usersSnapshot.empty) {
          console.log("Database is empty. Seeding initial data...");
          
          // Seed users
          for (const user of INITIAL_USERS) {
            const { id, ...userData } = user; // Firestore generates its own ID
            await addDoc(collection(db, "users"), userData);
          }
          
          // Seed equipment
          for (const eq of INITIAL_EQUIPMENT) {
            const { id, ...eqData } = eq;
            await addDoc(collection(db, "equipment"), eqData);
          }
          console.log("Seeding complete.");
          // Optional: Reload or notify user to refresh
        }
      } catch (error) {
        console.error("Error seeding database: ", error);
      }
    };
    seedDatabase();
  }, []);

  // Real-time listeners for all data collections
  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestampsToDates(doc.data()) } as User));
        setUsers(usersData);
    });
    
    const unsubscribeEquipment = onSnapshot(collection(db, "equipment"), (snapshot) => {
        const equipmentData = snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestampsToDates(doc.data()) } as Equipment));
        setEquipment(equipmentData.sort((a,b) => b.serviceEntryDate.getTime() - a.serviceEntryDate.getTime()));
    });

    const unsubscribeRentals = onSnapshot(collection(db, "rentals"), (snapshot) => {
        const rentalsData = snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestampsToDates(doc.data()) } as Rental));
        setRentals(rentalsData.sort((a,b) => b.startTime.getTime() - a.startTime.getTime()));
    });
    
    const unsubscribeLog = onSnapshot(query(collection(db, "activityLog")), (snapshot) => {
        const logData = snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestampsToDates(doc.data()) } as ActivityLog));
        setActivityLog(logData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    });

    // Clean up subscriptions on unmount
    return () => {
        unsubscribeUsers();
        unsubscribeEquipment();
        unsubscribeRentals();
        unsubscribeLog();
    };
  }, []);
  
  const logActivity = async (type: ActivityType, details: string) => {
    if (!currentUser) return;
    try {
        await addDoc(collection(db, "activityLog"), {
            timestamp: serverTimestamp(),
            userId: currentUser.id,
            username: currentUser.username,
            type,
            details,
        });
    } catch (error) {
        console.error("Error logging activity: ", error);
    }
  };

  const login = async (username: string, password_param: string): Promise<boolean> => {
    const q = query(collection(db, "users"), where("username", "==", username), where("password", "==", password_param));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const user = { id: userDoc.id, ...userDoc.data() } as User;
        setCurrentUser(user);
        return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUser = async (userData: Omit<User, 'id' | 'role'>) => {
    if (currentUser?.role !== UserRole.MANAGER) return;
    try {
        await addDoc(collection(db, "users"), { ...userData, role: UserRole.WORKER });
        await logActivity(ActivityType.ADD_WORKER, `أضاف العامل الجديد: ${userData.username}`);
    } catch (error) {
        console.error("Error adding user: ", error);
    }
  };

  const addEquipment = async (eqData: Omit<Equipment, 'id' | 'status' | 'serviceEntryDate' | 'totalRevenue'>) => {
    if (currentUser?.role !== UserRole.MANAGER) return;
    try {
        await addDoc(collection(db, "equipment"), {
            ...eqData,
            status: EquipmentStatus.AVAILABLE,
            serviceEntryDate: new Date(),
            totalRevenue: 0,
        });
        await logActivity(ActivityType.ADD_EQUIPMENT, `أضاف أداة جديدة: ${eqData.name}`);
    } catch (error) {
        console.error("Error adding equipment: ", error);
    }
  };

  const updateEquipment = async (id: string, updates: Partial<Omit<Equipment, 'id' | 'serviceEntryDate' | 'totalRevenue'>>) => {
    if (currentUser?.role !== UserRole.MANAGER && !updates.status) return;
    const eqDocRef = doc(db, "equipment", id);
    try {
        await updateDoc(eqDocRef, updates);
        const eqName = updates.name || equipment.find(e => e.id === id)?.name;
        if (updates.status) {
            await logActivity(ActivityType.STATUS_CHANGE, `غير حالة الأداة ${eqName} إلى ${updates.status}`);
        } else {
            await logActivity(ActivityType.UPDATE_EQUIPMENT, `عدّل بيانات الأداة: ${eqName}`);
        }
    } catch (error) {
        console.error("Error updating equipment: ", error);
    }
  };

  const deleteEquipment = async (id: string) => {
    if (currentUser?.role !== UserRole.MANAGER) return;
    const eqToDelete = equipment.find(e => e.id === id);
    if (eqToDelete) {
        try {
            await deleteDoc(doc(db, "equipment", id));
            await logActivity(ActivityType.DELETE_EQUIPMENT, `حذف الأداة: ${eqToDelete.name}`);
        } catch (error) {
            console.error("Error deleting equipment: ", error);
        }
    }
  };

  const rentEquipment = async (rentalData: Omit<Rental, 'id' | 'startTime' | 'workerId' | 'workerUsername' | 'equipmentName'>) => {
    if (!currentUser) return;
    const equipmentToRent = equipment.find(e => e.id === rentalData.equipmentId);
    if (!equipmentToRent) return;
    
    try {
        await addDoc(collection(db, "rentals"), {
            ...rentalData,
            startTime: new Date(),
            workerId: currentUser.id,
            workerUsername: currentUser.username,
            equipmentName: equipmentToRent.name,
        });
        await updateDoc(doc(db, "equipment", rentalData.equipmentId), { status: EquipmentStatus.RENTED });
        await logActivity(ActivityType.RENT, `أجّر الأداة ${equipmentToRent.name} للعميل ${rentalData.customerPhone}`);
    } catch (error) {
        console.error("Error renting equipment: ", error);
    }
  };
  
  const returnEquipment = async (equipmentId: string) => {
    const rentalToEnd = rentals.find(r => r.equipmentId === equipmentId && !r.endTime);
    if (!rentalToEnd || !currentUser) return;

    const endTime = new Date();
    const durationHours = (endTime.getTime() - rentalToEnd.startTime.getTime()) / (1000 * 60 * 60);
    const equipmentItem = equipment.find(eq => eq.id === equipmentId);
    if (!equipmentItem) return;

    let cost = 0;
    const fullDays = Math.floor(durationHours / 24);
    const remainingHours = durationHours % 24;
    cost += fullDays * equipmentItem.dailyRate;
    const hourlyCostForRemainder = Math.ceil(remainingHours) * equipmentItem.hourlyRate;
    cost += (hourlyCostForRemainder > equipmentItem.dailyRate) ? equipmentItem.dailyRate : hourlyCostForRemainder;
    const finalCost = parseFloat(cost.toFixed(2));

    try {
        await updateDoc(doc(db, "rentals", rentalToEnd.id), { endTime, totalCost: finalCost });
        await updateDoc(doc(db, "equipment", equipmentId), { 
            status: EquipmentStatus.AVAILABLE, 
            totalRevenue: equipmentItem.totalRevenue + finalCost 
        });
        await logActivity(ActivityType.RETURN, `أنهى كراء الأداة ${equipmentItem.name}. التكلفة: $${finalCost}`);
    } catch (error) {
        console.error("Error returning equipment: ", error);
    }
  };

  const contextValue = useMemo(() => ({
    currentUser,
    users,
    equipment,
    rentals,
    activityLog,
    login,
    logout,
    addUser,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    rentEquipment,
    returnEquipment,
  }), [currentUser, users, equipment, rentals, activityLog]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};