import React from 'react';
import { Equipment, EquipmentStatus, UserRole } from '../../types';
import { EditIcon, TrashIcon, CurrencyDollarIcon, CalendarDaysIcon, ClockIcon } from '../ui/Icons';
import { useAppContext } from '../../hooks/useAppContext';

interface EquipmentCardProps {
  equipment: Equipment;
  onEdit: (equipment: Equipment) => void;
  onDelete: (id: string) => void;
  onRent: (equipment: Equipment) => void;
  onReturn: (equipment: Equipment) => void;
  onStatusChange: (equipment: Equipment) => void;
}

const getStatusClasses = (status: EquipmentStatus) => {
  switch (status) {
    case EquipmentStatus.AVAILABLE:
      return { bg: 'bg-green-500/10', text: 'text-green-400', ring: 'ring-green-500/20' };
    case EquipmentStatus.RENTED:
      return { bg: 'bg-red-500/10', text: 'text-red-400', ring: 'ring-red-500/20' };
    case EquipmentStatus.MAINTENANCE:
      return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', ring: 'ring-yellow-500/20' };
    default:
      return { bg: 'bg-gray-500/10', text: 'text-gray-400', ring: 'ring-gray-500/20' };
  }
};


const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onEdit, onDelete, onRent, onReturn, onStatusChange }) => {
  const { currentUser } = useAppContext();
  const isManager = currentUser?.role === UserRole.MANAGER;
  const statusClasses = getStatusClasses(equipment.status);

  const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  }

  return (
    <div className="bg-accent rounded-xl shadow-lg flex flex-col justify-between transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1 border border-accent-light">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-text-main">{equipment.name}</h3>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses.bg} ${statusClasses.text} ring-1 ring-inset ${statusClasses.ring}`}>
                {equipment.status}
            </span>
        </div>
        
        <div className="space-y-3 text-sm">
            <div className="flex items-center text-text-secondary">
                <ClockIcon className="w-4 h-4 ml-2 text-primary"/>
                <span>سعر الساعة:</span>
                <span className="mr-auto font-semibold text-text-main">${equipment.hourlyRate.toFixed(2)}</span>
            </div>
            <div className="flex items-center text-text-secondary">
                <CalendarDaysIcon className="w-4 h-4 ml-2 text-primary"/>
                <span>سعر اليوم:</span>
                <span className="mr-auto font-semibold text-text-main">${equipment.dailyRate.toFixed(2)}</span>
            </div>
        </div>

        {isManager && (
            <div className="mt-4 pt-4 border-t border-accent-light space-y-3 text-sm">
                <div className="flex items-center text-text-secondary">
                    <CurrencyDollarIcon className="w-4 h-4 ml-2 text-green-400"/>
                    <span>إجمالي الأرباح:</span>
                    <span className="mr-auto font-semibold text-green-400">${equipment.totalRevenue.toFixed(2)}</span>
                </div>
                <div className="flex items-center text-text-secondary">
                    <CalendarDaysIcon className="w-4 h-4 ml-2 text-blue-400"/>
                    <span>في الخدمة منذ:</span>
                    <span className="mr-auto font-semibold text-text-main">{formatDate(equipment.serviceEntryDate)}</span>
                </div>
            </div>
        )}
      </div>

      <div className="bg-accent-light/50 p-3 flex justify-center items-center space-x-2">
        {isManager ? (
            <>
                <button onClick={() => onEdit(equipment)} className="p-2 text-blue-400 hover:text-blue-300 rounded-full bg-accent hover:bg-accent-light transition-colors" aria-label="Edit"><EditIcon className="w-4 h-4" /></button>
                <button onClick={() => onDelete(equipment.id)} className="p-2 text-red-500 hover:text-red-400 rounded-full bg-accent hover:bg-accent-light transition-colors" aria-label="Delete"><TrashIcon className="w-4 h-4" /></button>
                <button onClick={() => onStatusChange(equipment)} className="flex-1 text-xs bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-3 rounded-md transition-colors">تغيير الحالة</button>
            </>
        ) : (
            <div className='w-full'>
                {equipment.status === EquipmentStatus.AVAILABLE && (
                    <button onClick={() => onRent(equipment)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                        كراء
                    </button>
                )}
                {equipment.status === EquipmentStatus.RENTED && (
                    <button onClick={() => onReturn(equipment)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                        إنهاء الكراء
                    </button>
                )}
                {equipment.status === EquipmentStatus.MAINTENANCE && (
                    <button className="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded-md cursor-not-allowed" disabled>
                        غير متاح
                    </button>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentCard;