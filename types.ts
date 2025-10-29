export enum UserRole {
  MANAGER = 'MANAGER',
  WORKER = 'WORKER',
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
}

export enum EquipmentStatus {
  AVAILABLE = 'متاحة',
  RENTED = 'مؤجرة',
  MAINTENANCE = 'في الصيانة',
}

export interface Equipment {
  id: string;
  name: string;
  hourlyRate: number;
  dailyRate: number;
  status: EquipmentStatus;
  serviceEntryDate: Date;
  totalRevenue: number;
}

export interface Rental {
  id: string;
  equipmentId: string;
  equipmentName: string; // denormalized for easier logging
  customerPhone: string;
  guaranteeDocument: string;
  startTime: Date;
  endTime?: Date;
  totalCost?: number;
  workerId: string;
  workerUsername: string; // denormalized for easier logging
}

export enum ActivityType {
  RENT = 'RENT',
  RETURN = 'RETURN',
  ADD_EQUIPMENT = 'ADD_EQUIPMENT',
  UPDATE_EQUIPMENT = 'UPDATE_EQUIPMENT',
  DELETE_EQUIPMENT = 'DELETE_EQUIPMENT',
  ADD_WORKER = 'ADD_WORKER',
  STATUS_CHANGE = 'STATUS_CHANGE',
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  userId: string;
  username: string;
  type: ActivityType;
  details: string;
}