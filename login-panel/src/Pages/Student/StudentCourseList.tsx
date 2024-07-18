import React, { useEffect, useState } from 'react';
import { StudentLayout } from 'Components/Student/StudentLayout';
import { useHistory, Link } from 'react-router-dom';
import { sendPostRequest} from 'Plugins/CommonUtils/SendPostRequest';
import { StudentCourse } from 'Plugins/CommonUtils/StudentUtils';
import { StudentGetCourseListMessage } from 'Plugins/StudentAPI/StudentGetCourseListMessage';
import { StudentAddCourseMessage } from 'Plugins/StudentAPI/StudentAddCourseMessage';
import { StudentManualSelectCourseMessage } from 'Plugins/StudentAPI/StudentManualSelectCourseMessage';
import { StudentGetAllCoursesByUsernameMessage } from 'Plugins/StudentAPI/StudentGetAllCoursesByUsernameMessage';
import { StudentGetCreditsMessage } from 'Plugins/StudentAPI/StudentGetCreditsMessage';
import { StudentGetPlanMessage } from 'Plugins/StudentAPI/StudentGetPlanMessage';
import Auth from 'Plugins/CommonUtils/AuthState';
import { FaSync, FaPlus, FaSortUp, FaSortDown, FaSearch, FaHandPaper } from 'react-icons/fa';
import { ManualSelectBox } from 'Components/Student/ManualSelectBox';
import { CourseTable } from 'Components/CourseTable';

type SearchColumn = 'ID' | 'Name' | 'Teacher' | 'Status' | 'All';

export function StudentCourseList() {
    const [studentUsername, setStudentUsername] = useState<string>('');
    const [courses, setCourses] = useState<StudentCourse[]>([]);
    const [credits, setCredits] = useState<number | null>(null);
    const [plan, setPlan] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [addCourseResponse, setAddCourseResponse] = useState<string>('');
    const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
    const [showAddResponse, setShowAddResponse] = useState<boolean>(false);
    const [sortColumn, setSortColumn] = useState<keyof StudentCourse>('courseid');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchColumn, setSearchColumn] = useState<SearchColumn>('All');
    const [showManualSelectionPopup, setShowManualSelectionPopup] = useState(false);
    const [selectedCourseForManual, setSelectedCourseForManual] = useState<StudentCourse | null>(null);
    const [selectedPriority, setSelectedPriority] = useState<number>(3);
    const history = useHistory();

    useEffect(() => {
        getCourseList();
        fetchSelectedCourses();
        setStudentUsername(Auth.getState().username);
        getCredits();
        getPlan();
    }, []);

    const fetchSelectedCourses = async () => {
        const response = await sendPostRequest(new StudentGetAllCoursesByUsernameMessage(Auth.getState().username));
        if (response.isError) {
            if (!response.error.startsWith("No courses found")) {
                setErrorMessage(response.error);
            }
            setSelectedCourseIds([]);
            return;
        }
        try {
            const selectedCourses: StudentCourse[] = response.data;
            setSelectedCourseIds(selectedCourses.map(course => course.courseid));
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error parsing course data');
        }
    };

    const addCourseWithId = async (courseid: number) => {
        const priority = 3 - selectedPriority; // 将选择的优先度转换为对应的值
        const response = await sendPostRequest(new StudentAddCourseMessage(courseid, priority));
        if (response.isError) {
            setAddCourseResponse(response.error);
            return;
        }
        setAddCourseResponse('Course ' + courseid + ' added successfully');
        setShowAddResponse(true);
        setTimeout(() => setShowAddResponse(false), 2000);
        fetchSelectedCourses();
    };

    const getCourseList = async () => {
        const response = await sendPostRequest(new StudentGetCourseListMessage());
        if (response.isError) {
            setErrorMessage(response.error);
            return;
        }
        try {
            setCourses(response.data);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error parsing course data');
        }
    };

    const getCredits = async () => {
        const response = await sendPostRequest(new StudentGetCreditsMessage());
        if (response.isError) {
            setErrorMessage(response.error);
            return;
        }
        try {
            setCredits(response.data);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error parsing credits data');
        }
    };

    const getPlan = async () => {
        const response = await sendPostRequest(new StudentGetPlanMessage());
        if (response.isError) {
            setErrorMessage(response.error);
            return;
        }
        try {
            setPlan(response.data);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error parsing plan data');
        }
    };

    const handleSort = (column: keyof StudentCourse) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const sortedCourses = [...courses].sort((a, b) => {
        if (sortDirection === 'asc') {
            return a[sortColumn] < b[sortColumn] ? -1 : 1;
        } else {
            return a[sortColumn] > b[sortColumn] ? -1 : 1;
        }
    });

    const filterCourses = (courses: StudentCourse[]) => {
        return courses.filter(course => {
            if (searchTerm === '') return true;
            const lowerSearchTerm = searchTerm.toLowerCase();
            switch (searchColumn) {
                case 'ID':
                    return course.courseid.toString().includes(lowerSearchTerm);
                case 'Name':
                    return course.courseName.toLowerCase().includes(lowerSearchTerm);
                case 'Teacher':
                    return course.teacherName.toLowerCase().includes(lowerSearchTerm);
                case 'Status':
                    return course.status.toLowerCase().includes(lowerSearchTerm);
                case 'All':
                    return (
                        course.courseid.toString().includes(lowerSearchTerm) ||
                        course.courseName.toLowerCase().includes(lowerSearchTerm) ||
                        course.teacherName.toLowerCase().includes(lowerSearchTerm) ||
                        course.status.toLowerCase().includes(lowerSearchTerm)
                    );
                default:
                    return true;
            }
        });
    };

    const filteredAndSortedCourses = filterCourses(sortedCourses).filter(course => !selectedCourseIds.includes(course.courseid));

    const SortIcon = ({ column }: { column: keyof StudentCourse }) => {
        if (column !== sortColumn) return null;
        return sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
    };

    const renderSortableHeader = (column: keyof StudentCourse, label: string) => (
        <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort(column)}
        >
            <div className="flex items-center">
                {label}
                <SortIcon column={column} />
            </div>
        </th>
    );

    const handleManualSelection = (course: StudentCourse) => {
        setSelectedCourseForManual(course);
        setShowManualSelectionPopup(true);
    };

    const confirmManualSelection = async (reason: string) => {
        if (selectedCourseForManual) {
            const response = await sendPostRequest(new StudentManualSelectCourseMessage(selectedCourseForManual.courseid, reason));
            if (response.isError) {
                setErrorMessage(response.error);
            } else {
                setAddCourseResponse(`Manual selection request for course ${selectedCourseForManual.courseid} sent successfully`);
                setShowAddResponse(true);
                setTimeout(() => setShowAddResponse(false), 2000);
            }
            setShowManualSelectionPopup(false);
            setSelectedCourseForManual(null);
        }
    };

    const cancelManualSelection = () => {
        setShowManualSelectionPopup(false);
        setSelectedCourseForManual(null);
    };

    const renderProgressBar = () => {
        const defaultMinCredits = 6;
        const defaultMaxCredits = 26;

        const minCredits = plan ? plan.creditsLimits[Object.keys(plan.creditsLimits)[0]].min : defaultMinCredits;
        const maxCredits = plan ? plan.creditsLimits[Object.keys(plan.creditsLimits)[0]].max : defaultMaxCredits;
        const Credits = credits || 0;
        const maxCreditsPlusOne = maxCredits + 6;

        const creditsPercentage = (Credits / maxCreditsPlusOne) * 100;
        const minCreditsPercentage = (minCredits / maxCreditsPlusOne) * 100;
        const maxCreditsPercentage = (maxCredits / maxCreditsPlusOne) * 100;

        let message = '';
        if (Credits < minCredits) {
            message = '你上的课太少，你要被退学了';
        } else if (Credits > maxCredits && Credits <= maxCredits + 6) {
            message = '你选得有点多';
        } else if (Credits > maxCredits + 6) {
            message = '进度条都放不下了，少卷点好不好';
        }

        return (
            <div className="relative w-full mt-8"> {/* 增加顶部外边距 */}
                <div className="relative w-full mb-4 text-xs text-gray-600">
                <span
                    style={{
                        position: 'absolute',
                        left: `${minCreditsPercentage}%`,
                        transform: 'translateX(-50%)',
                        bottom: '100%',
                        textAlign: 'center',
                        whiteSpace: 'pre-wrap'
                    }}
                >
                    {'minimum\ncredits:\n' + minCredits}
                </span>
                    <span
                        style={{
                            position: 'absolute',
                            left: `${maxCreditsPercentage}%`,
                            transform: 'translateX(-50%)',
                            bottom: '100%',
                            textAlign: 'center',
                            whiteSpace: 'pre-wrap'
                        }}
                    >
                    {'max\ncredits:\n' + maxCredits}
                </span>
                </div>
                <div className="w-full h-6 bg-gray-200 rounded-l-full relative">
                    <div className="absolute left-0 top-0 h-full bg-red-500 rounded-l-full"
                         style={{ width: `${minCreditsPercentage}%` }}></div>
                    <div className="absolute left-0 top-0 h-full bg-green-500" style={{
                        width: `${maxCreditsPercentage - minCreditsPercentage}%`,
                        left: `${minCreditsPercentage}%`
                    }}></div>
                    <div className="absolute left-0 top-0 h-full bg-blue-500 bg-opacity-50 rounded-l-full" style={{
                        width: `${creditsPercentage}%`,
                        borderRadius: creditsPercentage > 0 ? '9999px 0 0 9999px' : '9999px'
                    }}></div>
                    <div className="absolute top-0 h-full border-l-2 border-blue-500"
                         style={{ left: `${creditsPercentage}%` }}></div>
                    <div className="absolute top-0 h-full bg-red-500" style={{
                        width: `${100 - maxCreditsPercentage}%`,
                        left: `${maxCreditsPercentage}%`,
                        borderRadius: '0 9999px 9999px 0'
                    }}></div>
                </div>
                <div className="relative w-full mt-2 text-xs text-gray-600">
                <span
                    style={{
                        position: 'absolute',
                        left: `${creditsPercentage}%`,
                        transform: 'translateX(-50%)',
                        top: '100%',
                        textAlign: 'center',
                        whiteSpace: 'pre-wrap'
                    }}
                >
                    {'selected\ncredits:\n' + Credits}
                </span>
                </div>
                {message && (
                    <div className="mt-4 text-center text-red-500">
                        {message}
                    </div>
                )}
            </div>
        );
    };

    const getBigPriority = (courseid: number) => {
        if (plan && plan.priority && plan.priority.year) {
            return plan.priority.year[courseid] ?? 0;
        }
        return 0;
    };

    const coursesByPriority = filteredAndSortedCourses.reduce((acc: { [key: number]: StudentCourse[] }, course) => {
        const bigPriority = getBigPriority(course.courseid);
        if (!acc[bigPriority]) acc[bigPriority] = [];
        acc[bigPriority].push(course);
        return acc;
    }, {});

    const renderCoursesByPriority = (priority: number, label: string) => (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{label}</h3>
                <div>
                    <label htmlFor={`priority-${priority}`} className="mr-2 text-gray-700 dark:text-gray-300">Select Priority:</label>
                    <select
                        id={`priority-${priority}`}
                        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        defaultValue={3}
                    >
                        <option value={1}>第1志愿</option>
                        <option value={2}>第2志愿</option>
                        <option value={3}>第3志愿</option>
                    </select>
                </div>
            </div>
            {coursesByPriority[priority] && coursesByPriority[priority].length > 0 ? (
                <CourseTable
                    columns={[
                        'Course ID',
                        'Course Name',
                        'Teacher',
                        'Capacity',
                        'All Students Number',
                        'Enrolled Students Number',
                        'Credits',
                        'Info',
                        'Status',
                        'Options'
                    ]}
                    data={coursesByPriority[priority]}
                    renderCell={(item, column) => {
                        switch (column) {
                            case 'Course ID':
                                return <Link to={`/student/course/${item.courseid}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">{item.courseid}</Link>;
                            case 'Course Name':
                                return <span>{item.courseName}</span>;
                            case 'Teacher':
                                return <span>{item.teacherName}</span>;
                            case 'Capacity':
                                return <span>{item.capacity}</span>;
                            case 'All Students Number':
                                return <span>{item.allStudentsNumber}</span>;
                            case 'Enrolled Students Number':
                                return <span>{item.enrolledStudentsNumber}</span>;
                            case 'Credits':
                                return <span>{item.credits}</span>;
                            case 'Info':
                                return <span>{item.info}</span>;
                            case 'Status':
                                return <span>{item.status}</span>;
                            case 'Options':
                                return (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => addCourseWithId(item.courseid)}
                                            className="text-green-600 hover:text-green-900 dark:hover:text-green-400"
                                            title="Select course"
                                        >
                                            <FaPlus />
                                        </button>
                                        <button
                                            onClick={() => handleManualSelection(item)}
                                            className="text-orange-600 hover:text-orange-900 dark:hover:text-orange-400"
                                            title="Manual Selection"
                                        >
                                            <FaHandPaper />
                                        </button>
                                    </div>
                                );
                            default:
                                return null;
                        }
                    }}
                />
            ) : (
                <p className="text-gray-500 dark:text-gray-400">No available courses found matching your search criteria.</p>
            )}
        </div>
    );



    return (
        <StudentLayout>
            <div className="space-y-6">
                {renderProgressBar()}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Course List</h2>
                    <button
                        onClick={getCourseList}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold p-2 rounded transition duration-300"
                        title="Refresh course list"
                    >
                        <FaSync />
                    </button>
                </div>

                <div className="flex space-x-4 mb-4">
                    <button
                        onClick={() => setSelectedPriority(2)}
                        className={`px-4 py-2 rounded ${selectedPriority === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        必修课
                    </button>
                    <button
                        onClick={() => setSelectedPriority(1)}
                        className={`px-4 py-2 rounded ${selectedPriority === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        限选课
                    </button>
                    <button
                        onClick={() => setSelectedPriority(0)}
                        className={`px-4 py-2 rounded ${selectedPriority === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        任选课
                    </button>
                </div>

                {selectedPriority === 2 && renderCoursesByPriority(2, '必修课')}
                {selectedPriority === 1 && renderCoursesByPriority(1, '限选课')}
                {selectedPriority === 0 && renderCoursesByPriority(0, '任选课')}

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                {showAddResponse && (
                    <div className="fixed bottom-4 right-4 bg-green-500 text-white p-2 rounded shadow-lg">
                        {addCourseResponse}
                    </div>
                )}

                {showManualSelectionPopup && selectedCourseForManual && (
                    <ManualSelectBox
                        course={selectedCourseForManual}
                        onConfirm={confirmManualSelection}
                        onCancel={cancelManualSelection}
                    />
                )}
            </div>
        </StudentLayout>
    );

}
