import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Equipment, EquipmentStatus, UserRole } from '../../types';
import EquipmentCard from './EquipmentCard';
import Modal from '../ui/Modal';
import { PlusIcon, UserPlusIcon } from '../ui/Icons';

// --- Reusable Form Components ---
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
}
const InputField: React.FC<InputFieldProps> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
        <input id={id} {...props} className="w-full bg-secondary text-text-main p-3 border border-accent-light rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition" />
    </div>
);

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    id: string;
    children: React.ReactNode;
}
const SelectField: React.FC<SelectFieldProps> = ({ label, id, children, ...props }) => (
     <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
        <select id={id} {...props} className="w-full bg-secondary text-text-main p-3 border border-accent-light rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition">
            {children}
        </select>
    </div>
);

// --- Main Component ---
const EquipmentList: React.FC = () => {
    const { currentUser, equipment, addEquipment, updateEquipment, deleteEquipment, rentEquipment, returnEquipment, rentals, addUser } = useAppContext();
    const isManager = currentUser?.role === UserRole.MANAGER;

    const [isEqModalOpen, setIsEqModalOpen] = useState(false);
    const [isRentModalOpen, setIsRentModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

    const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
    const [eqFormData, setEqFormData] = useState({ name: '', hourlyRate: '', dailyRate: '' });
    const [rentFormData, setRentFormData] = useState({ customerPhone: '', guaranteeDocument: 'بطاقة التعريف الوطنية', customDocument: '' });
    const [userFormData, setUserFormData] = useState({ username: '', password: '' });

    const [filter, setFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const openEqModal = (eq: Equipment | null = null) => {
        setSelectedEquipment(eq);
        setEqFormData(eq ? { name: eq.name, hourlyRate: String(eq.hourlyRate), dailyRate: String(eq.dailyRate) } : { name: '', hourlyRate: '', dailyRate: '' });
        setIsEqModalOpen(true);
    };

    const openRentModal = (eq: Equipment) => {
        setSelectedEquipment(eq);
        setIsRentModalOpen(true);
    };
    
    const openStatusModal = (eq: Equipment) => {
        setSelectedEquipment(eq);
        setIsStatusModalOpen(true);
    }
    
    const closeModals = () => {
        setIsEqModalOpen(false);
        setIsRentModalOpen(false);
        setIsUserModalOpen(false);
        setIsStatusModalOpen(false);
        setSelectedEquipment(null);
        setRentFormData({ customerPhone: '', guaranteeDocument: 'بطاقة التعريف الوطنية', customDocument: '' });
        setUserFormData({ username: '', password: '' });
    };

    const handleEqSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            name: eqFormData.name,
            hourlyRate: parseFloat(eqFormData.hourlyRate),
            dailyRate: parseFloat(eqFormData.dailyRate),
        };

        if (selectedEquipment) {
            updateEquipment(selectedEquipment.id, data);
        } else {
            addEquipment(data);
        }
        closeModals();
    };

    const handleRentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEquipment) return;
        
        const document = rentFormData.guaranteeDocument === ' أخرى' 
            ? rentFormData.customDocument 
            : rentFormData.guaranteeDocument;
            
        rentEquipment({
            equipmentId: selectedEquipment.id,
            customerPhone: rentFormData.customerPhone,
            guaranteeDocument: document
        });
        closeModals();
    };
    
    const handleReturn = (eq: Equipment) => {
        returnEquipment(eq.id);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الأداة؟')) {
            deleteEquipment(id);
        }
    };

    const handleUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addUser({ ...userFormData });
        closeModals();
    };

    const handleStatusChange = (newStatus: EquipmentStatus) => {
        if(selectedEquipment) {
            updateEquipment(selectedEquipment.id, { status: newStatus });
        }
        closeModals();
    }

    const filteredEquipment = useMemo(() => {
        return equipment
            .filter(eq => filter === 'all' || eq.status === filter)
            .filter(eq => eq.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [equipment, filter, searchTerm]);
    
    const activeRentals = rentals.filter(r => !r.endTime);

    return (
        <>
            <div className="mb-6 bg-accent p-4 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="w-full md:w-auto md:flex-1">
                    <input
                        type="text"
                        placeholder="...بحث عن أداة"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-secondary p-3 rounded-lg border border-accent-light focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="flex items-center gap-2 bg-secondary p-1 rounded-lg">
                    <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm rounded-md transition-colors ${filter === 'all' ? 'bg-primary text-secondary font-semibold' : 'hover:bg-accent'}`}>الكل</button>
                    <button onClick={() => setFilter(EquipmentStatus.AVAILABLE)} className={`px-4 py-2 text-sm rounded-md transition-colors ${filter === EquipmentStatus.AVAILABLE ? 'bg-green-500 text-white font-semibold' : 'hover:bg-accent'}`}>{EquipmentStatus.AVAILABLE}</button>
                    <button onClick={() => setFilter(EquipmentStatus.RENTED)} className={`px-4 py-2 text-sm rounded-md transition-colors ${filter === EquipmentStatus.RENTED ? 'bg-red-500 text-white font-semibold' : 'hover:bg-accent'}`}>{EquipmentStatus.RENTED}</button>
                    <button onClick={() => setFilter(EquipmentStatus.MAINTENANCE)} className={`px-4 py-2 text-sm rounded-md transition-colors ${filter === EquipmentStatus.MAINTENANCE ? 'bg-yellow-500 text-gray-800 font-semibold' : 'hover:bg-accent'}`}>{EquipmentStatus.MAINTENANCE}</button>
                </div>
                {isManager && (
                    <div className="flex gap-2">
                        <button onClick={() => openEqModal()} className="bg-primary hover:bg-primary-dark text-secondary font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform hover:scale-105">
                            <PlusIcon className="h-5 w-5"/> <span>أداة جديدة</span>
                        </button>
                        <button onClick={() => setIsUserModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform hover:scale-105">
                           <UserPlusIcon className="h-5 w-5"/> <span>عامل جديد</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEquipment.map(eq => (
                    <EquipmentCard 
                        key={eq.id} 
                        equipment={eq} 
                        onEdit={openEqModal}
                        onDelete={handleDelete}
                        onRent={openRentModal}
                        onReturn={handleReturn}
                        onStatusChange={openStatusModal}
                    />
                ))}
            </div>
            
            {filteredEquipment.length === 0 && (
                <div className="text-center py-10 col-span-full">
                    <p className="text-text-secondary text-lg">.لا توجد معدات تطابق بحثك</p>
                </div>
            )}

            {/* Modals */}
            <Modal isOpen={isEqModalOpen} onClose={closeModals} title={selectedEquipment ? 'تعديل الأداة' : 'إضافة أداة جديدة'}>
                <form onSubmit={handleEqSubmit} className="space-y-4 pt-2">
                    <InputField label="اسم الأداة" id="eqName" type="text" value={eqFormData.name} onChange={e => setEqFormData({ ...eqFormData, name: e.target.value })} required />
                    <InputField label="سعر الساعة" id="hourlyRate" type="number" step="0.01" min="0" value={eqFormData.hourlyRate} onChange={e => setEqFormData({ ...eqFormData, hourlyRate: e.target.value })} required />
                    <InputField label="سعر اليوم" id="dailyRate" type="number" step="0.01" min="0" value={eqFormData.dailyRate} onChange={e => setEqFormData({ ...eqFormData, dailyRate: e.target.value })} required />
                    <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-secondary font-bold py-3 px-4 rounded-lg mt-4 transition">{selectedEquipment ? 'حفظ التعديلات' : 'إضافة'}</button>
                </form>
            </Modal>

            <Modal isOpen={isRentModalOpen} onClose={closeModals} title={`كراء: ${selectedEquipment?.name}`}>
                <form onSubmit={handleRentSubmit} className="space-y-4 pt-2">
                    <InputField label="رقم هاتف الزبون" id="customerPhone" type="tel" value={rentFormData.customerPhone} onChange={e => setRentFormData({ ...rentFormData, customerPhone: e.target.value })} required />
                    <SelectField label="نوع وثيقة الضمان" id="guaranteeDocument" value={rentFormData.guaranteeDocument} onChange={e => setRentFormData({ ...rentFormData, guaranteeDocument: e.target.value })}>
                        <option>بطاقة التعريف الوطنية</option>
                        <option>رخصة السياقة</option>
                        <option> أخرى</option>
                    </SelectField>
                    {rentFormData.guaranteeDocument === ' أخرى' && (
                        <InputField label="حدد الوثيقة" id="customDocument" type="text" value={rentFormData.customDocument} onChange={e => setRentFormData({ ...rentFormData, customDocument: e.target.value })} required />
                    )}
                    <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-secondary font-bold py-3 px-4 rounded-lg mt-4 transition">تأكيد الكراء</button>
                </form>
            </Modal>
            
            <Modal isOpen={isUserModalOpen} onClose={closeModals} title="إضافة عامل جديد">
                <form onSubmit={handleUserSubmit} className="space-y-4 pt-2">
                    <InputField label="اسم المستخدم" id="username" type="text" value={userFormData.username} onChange={e => setUserFormData({ ...userFormData, username: e.target.value })} required />
                    <InputField label="كلمة المرور" id="password" type="password" value={userFormData.password} onChange={e => setUserFormData({ ...userFormData, password: e.target.value })} required />
                    <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-secondary font-bold py-3 px-4 rounded-lg mt-4 transition">إضافة عامل</button>
                </form>
            </Modal>
            
            <Modal isOpen={isStatusModalOpen} onClose={closeModals} title={`تغيير حالة: ${selectedEquipment?.name}`}>
                <div className="flex flex-col space-y-3 pt-2">
                    <button onClick={() => handleStatusChange(EquipmentStatus.AVAILABLE)} className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition">متاحة</button>
                    <button onClick={() => handleStatusChange(EquipmentStatus.RENTED)} className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition disabled:bg-red-900 disabled:cursor-not-allowed" disabled={activeRentals.some(r => r.equipmentId === selectedEquipment?.id)}>مؤجرة</button>
                    <button onClick={() => handleStatusChange(EquipmentStatus.MAINTENANCE)} className="w-full py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-bold transition">في الصيانة</button>
                </div>
            </Modal>

        </>
    );
};

export default EquipmentList;
