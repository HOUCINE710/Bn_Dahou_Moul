import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { EquipmentStatus } from '../../types';
import { ChartBarIcon, CurrencyDollarIcon } from '../ui/Icons';

const StatsCards: React.FC = () => {
    const { equipment, rentals } = useAppContext();

    const totalRevenue = equipment.reduce((acc, eq) => acc + eq.totalRevenue, 0);
    const activeRentals = rentals.filter(r => !r.endTime).length;
    const availableEquipment = equipment.filter(e => e.status === EquipmentStatus.AVAILABLE).length;
    const maintenanceEquipment = equipment.filter(e => e.status === EquipmentStatus.MAINTENANCE).length;

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-main mb-4">الإحصائيات</h2>
            <div className="space-y-4">
                <StatCard 
                    title="إجمالي الإيرادات"
                    value={`$${totalRevenue.toFixed(2)}`}
                    icon={<CurrencyDollarIcon />}
                    color="text-green-400"
                />
                 <StatCard 
                    title="الإيجارات النشطة"
                    value={activeRentals.toString()}
                    icon={<ChartBarIcon />}
                    color="text-blue-400"
                />
                 <StatCard 
                    title="المعدات المتاحة"
                    value={`${availableEquipment} / ${equipment.length}`}
                    icon={<ChartBarIcon />}
                    color="text-yellow-400"
                />
            </div>
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
    <div className="bg-accent p-4 rounded-xl shadow-md flex items-center justify-between border border-accent-light">
        <div>
            <p className="text-sm text-text-secondary">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`p-3 bg-accent-light rounded-full ${color}`}>
            {icon}
        </div>
    </div>
)

export default StatsCards;
