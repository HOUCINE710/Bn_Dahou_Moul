import { User, Equipment, UserRole, EquipmentStatus } from './types';

export const INITIAL_USERS: User[] = [
  { id: 'user-1', username: 'manager', password: 'password', role: UserRole.MANAGER },
  { id: 'user-2', username: 'worker1', password: 'password', role: UserRole.WORKER },
  { id: 'user-3', username: 'worker2', password: 'password', role: UserRole.WORKER },
];

export const INITIAL_EQUIPMENT: Equipment[] = [
  { id: 'eq-1', name: 'مطرقة هيدروليكية', hourlyRate: 15, dailyRate: 100, status: EquipmentStatus.AVAILABLE, serviceEntryDate: new Date('2023-01-15'), totalRevenue: 1250.50 },
  { id: 'eq-2', name: 'خلاط اسمنت', hourlyRate: 10, dailyRate: 70, status: EquipmentStatus.AVAILABLE, serviceEntryDate: new Date('2023-02-20'), totalRevenue: 850.00 },
  { id: 'eq-3', name: 'منشار كهربائي', hourlyRate: 8, dailyRate: 50, status: EquipmentStatus.RENTED, serviceEntryDate: new Date('2023-03-10'), totalRevenue: 600.75 },
  { id: 'eq-4', name: 'رافعة شوكية', hourlyRate: 50, dailyRate: 350, status: EquipmentStatus.MAINTENANCE, serviceEntryDate: new Date('2022-11-05'), totalRevenue: 5500.00 },
  { id: 'eq-5', name: 'ضاغط هواء', hourlyRate: 20, dailyRate: 150, status: EquipmentStatus.AVAILABLE, serviceEntryDate: new Date('2023-05-01'), totalRevenue: 980.25 },
  { id: 'eq-6', name: 'جهاز تسوية ليزر', hourlyRate: 25, dailyRate: 180, status: EquipmentStatus.AVAILABLE, serviceEntryDate: new Date('2023-06-12'), totalRevenue: 450.00 },
];
