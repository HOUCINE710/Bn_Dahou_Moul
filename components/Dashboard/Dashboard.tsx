import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { UserRole } from '../../types';
import Header from '../ui/Header';
import EquipmentList from './EquipmentList';
import StatsCards from './StatsCards';
import ActivityLogFeed from './ActivityLogFeed';

const Dashboard: React.FC = () => {
    const { currentUser } = useAppContext();
    const isManager = currentUser?.role === UserRole.MANAGER;

    return (
        <div className="min-h-screen flex flex-col bg-secondary">
            <Header />
            <main className="flex-grow p-4 sm:p-6 lg:p-8">
                {isManager && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                           <h2 className="text-2xl font-bold text-text-main mb-4">نظرة عامة على المعدات</h2>
                           <EquipmentList />
                        </div>
                        <div className="lg:col-span-1">
                            <StatsCards />
                            <ActivityLogFeed />
                        </div>
                    </div>
                )}
                {!isManager && <EquipmentList />}
            </main>
        </div>
    );
};

export default Dashboard;
