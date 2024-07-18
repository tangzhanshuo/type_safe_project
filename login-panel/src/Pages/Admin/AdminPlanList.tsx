import React, { useEffect, useState } from 'react';
import { sendPostRequest, Plan } from 'Plugins/CommonUtils/SendPostRequest';
import { AdminGetPlanMessage } from 'Plugins/AdminAPI/AdminGetPlanMessage';
import { AdminGetPlanListMessage } from 'Plugins/AdminAPI/AdminGetPlanListMessage';
import { AdminUpdateCoursePriorityMessage } from 'Plugins/AdminAPI/AdminUpdateCoursePriorityMessage';
import { AdminAddPlanMessage } from 'Plugins/AdminAPI/AdminAddPlanMessage';
import { AdminLayout } from 'Components/Admin/AdminLayout';
import { FaSync } from 'react-icons/fa';

export function AdminPlanList(): JSX.Element {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [planid, setPlanid] = useState<number>(0);
    const [planName, setPlanName] = useState<string>('');
    const [year, setYear] = useState<number>(1);
    const [courseid, setCourseid] = useState<number>(0);
    const [priority, setPriority] = useState<number>(0);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        getPlanList();
    }, []);

    const getPlanList = async () => {
        const response = await sendPostRequest(new AdminGetPlanListMessage());
        if (response.isError) {
            setMessage(response.error);
            return;
        }
        setPlans(response.data);
    };

    const getPlan = async () => {
        const response = await sendPostRequest(new AdminGetPlanMessage(planid));
        if (response.isError) {
            setMessage(response.error);
            return;
        }
        setSelectedPlan(response.data);
    };

    const updateCoursePriority = async () => {
        const response = await sendPostRequest(new AdminUpdateCoursePriorityMessage(planid, year, courseid, priority));
        if (response.isError) {
            setMessage(response.error);
            return;
        }
        setMessage('Course priority updated successfully');
        getPlan(); // Refresh the plan details after update
    };

    const addPlan = async () => {
        const response = await sendPostRequest(new AdminAddPlanMessage(planid, planName));
        if (response.isError) {
            setMessage(response.error);
            return;
        }
        setMessage('Plan added successfully');
        getPlanList(); // Refresh the plan list after adding a new plan
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Plan List</h2>
                    <button
                        onClick={getPlanList}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold p-2 rounded transition duration-300"
                        title="Refresh plan list"
                    >
                        <FaSync />
                    </button>
                </div>

                {message && <p className="text-red-500">{message}</p>}

                <table className="min-w-full bg-white dark:bg-gray-800">
                    <thead>
                    <tr>
                        <th className="px-6 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left leading-4 text-gray-500 dark:text-gray-300 tracking-wider">Plan ID</th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left leading-4 text-gray-500 dark:text-gray-300 tracking-wider">Plan Name</th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left leading-4 text-gray-500 dark:text-gray-300 tracking-wider">Priority</th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left leading-4 text-gray-500 dark:text-gray-300 tracking-wider">Credits Limits</th>
                    </tr>
                    </thead>
                    <tbody>
                    {plans.map(plan => (
                        <tr key={plan.planid}>
                            <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">{plan.planid}</td>
                            <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">{plan.planName}</td>
                            <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">{JSON.stringify(plan.priority)}</td>
                            <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">{JSON.stringify(plan.creditsLimits)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="mt-6">
                    <div className="flex space-x-4">
                        <div className="flex flex-col">
                            <label htmlFor="planid" className="mb-1">Plan ID</label>
                            <input
                                type="number"
                                id="planid"
                                value={planid}
                                onChange={(e) => setPlanid(Number(e.target.value))}
                                placeholder="Plan ID"
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="planName" className="mb-1">Plan Name</label>
                            <input
                                type="text"
                                id="planName"
                                value={planName}
                                onChange={(e) => setPlanName(e.target.value)}
                                placeholder="Plan Name"
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="year" className="mb-1">Year</label>
                            <select
                                id="year"
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="courseid" className="mb-1">Course ID</label>
                            <input
                                type="number"
                                id="courseid"
                                value={courseid}
                                onChange={(e) => setCourseid(Number(e.target.value))}
                                placeholder="Course ID"
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="priority" className="mb-1">Priority</label>
                            <select
                                id="priority"
                                value={priority}
                                onChange={(e) => setPriority(Number(e.target.value))}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={0}>任选课</option>
                                <option value={1}>限选课</option>
                                <option value={2}>必修课</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex space-x-4">
                        <button
                            onClick={getPlan}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                        >
                            Get Plan
                        </button>
                        <button
                            onClick={updateCoursePriority}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                        >
                            Update Course Priority
                        </button>
                        <button
                            onClick={addPlan}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                        >
                            Add Plan
                        </button>
                    </div>
                </div>

                {selectedPlan && (
                    <div className="mt-6">
                        <h3 className="text-xl font-bold">Selected Plan Details</h3>
                        <p><strong>Plan ID:</strong> {selectedPlan.planid}</p>
                        <p><strong>Plan Name:</strong> {selectedPlan.planName}</p>
                        <p><strong>Priority:</strong> {JSON.stringify(selectedPlan.priority)}</p>
                        <p><strong>Credits Limits:</strong> {JSON.stringify(selectedPlan.creditsLimits)}</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
