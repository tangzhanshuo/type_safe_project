import React, { useState } from 'react';

interface CourseHour {
    weekday: string;
    hours: string[];
}

interface CourseAddFormProps {
    isAdmin: boolean;
    onSubmit: (courseData: {
        courseName: string;
        teacherUsername?: string;
        capacity: number;
        info: string;
        courseHourArray: number[];
        classroomID: number;
        credits: number;
    }) => void;
}

export function CourseAddForm({ isAdmin, onSubmit }: CourseAddFormProps): JSX.Element {
    const [courseName, setCourseName] = useState<string>('');
    const [capacity, setCapacity] = useState<number | null>(null);
    const [info, setInfo] = useState<string>('');
    const [classroomID, setClassroomID] = useState<number | null>(null);
    const [credits, setCredits] = useState<number | null>(null);
    const [teacherUsername, setTeacherUsername] = useState<string>('');
    const [semesterHalf, setSemesterHalf] = useState<string>('2');
    const [courseHours, setCourseHours] = useState<CourseHour[]>([{ weekday: '0', hours: [] }]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const weekdays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots: string[] = [
        "8:00-9:35",
        "9:50-12:15",
        "13:30-15:05",
        "15:20-16:05",
        "19:20-20:55",
        "21:00-21:45"
    ];

    const addCourseHourSet = (): void => {
        const availableWeekday: number = weekdays.findIndex((_, index) =>
            !courseHours.some(ch => ch.weekday === index.toString())
        );
        if (availableWeekday !== -1) {
            setCourseHours([...courseHours, { weekday: availableWeekday.toString(), hours: [] }]);
            setErrorMessage('');
        } else {
            setErrorMessage('All weekdays have been selected.');
        }
    }

    const updateCourseHour = (index: number, field: keyof CourseHour, value: string | string[]): void => {
        const updatedCourseHours: CourseHour[] = [...courseHours];
        updatedCourseHours[index][field] = value as never; // Type assertion needed due to union type
        setCourseHours(updatedCourseHours);
    }

    const deleteCourseHourSet = (index: number): void => {
        const updatedCourseHours: CourseHour[] = courseHours.filter((_, i) => i !== index);
        setCourseHours(updatedCourseHours);
        setErrorMessage('');
    }

    const calculateCourseHourArray = (): number[] => {
        return courseHours.flatMap(({ weekday, hours }) => {
            const baseHours: number[] = hours.map(h => 6 * parseInt(weekday) + parseInt(h));
            if (semesterHalf === '2') {
                // Whole semester
                return baseHours.flatMap(h => [h, h + 42]);
            } else {
                return baseHours.map(h => h + 42 * parseInt(semesterHalf));
            }
        });
    }

    const handleSubmit = () => {
        if (!courseName || capacity === null || courseHours.length === 0 || classroomID === null || credits === null || (isAdmin && !teacherUsername)) {
            setErrorMessage('Please ensure all fields are correctly filled.');
            return;
        }
        const courseHourArray: number[] = calculateCourseHourArray();
        onSubmit({
            courseName,
            teacherUsername: isAdmin ? teacherUsername : undefined,
            capacity,
            info,
            courseHourArray,
            classroomID,
            credits
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <form className="space-y-4">
                    <input
                        id="courseName"
                        type="text"
                        value={courseName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCourseName(e.target.value)}
                        placeholder="Course Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    {isAdmin && (
                        <input
                            id="teacherUsername"
                            type="text"
                            value={teacherUsername}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTeacherUsername(e.target.value)}
                            placeholder="Teacher Username"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />
                    )}
                    <input
                        id="capacity"
                        type="number"
                        value={capacity === null ? '' : capacity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value;
                            setCapacity(value === '' ? null : parseInt(value));
                        }}
                        placeholder="Capacity (e.g., 30)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <input
                        id="classroomID"
                        type="number"
                        value={classroomID === null ? '' : classroomID}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value;
                            setClassroomID(value === '' ? null : parseInt(value));
                        }}
                        placeholder="Classroom ID (e.g. 101, -1 for no classroom)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <input
                        id="credits"
                        type="number"
                        value={credits === null ? '' : credits}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value;
                            setCredits(value === '' ? null : parseInt(value));
                        }}
                        placeholder="Credits (e.g., 3)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <textarea
                        id="info"
                        value={info}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInfo(e.target.value)}
                        placeholder="Course Info"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        rows={4}
                    />
                    <select
                        value={semesterHalf}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSemesterHalf(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    >
                        <option value="2">Whole Semester</option>
                        <option value="0">First Half of Semester</option>
                        <option value="1">Second Half of Semester</option>
                    </select>
                    {courseHours.map((courseHour: CourseHour, index: number) => (
                        <div key={index} className="space-y-2 border-t pt-2">
                            <div className="flex justify-between items-center">
                                <select
                                    value={courseHour.weekday}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateCourseHour(index, 'weekday', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                >
                                    {weekdays.map((day: string, dayIndex: number) => (
                                        <option
                                            key={dayIndex}
                                            value={dayIndex.toString()}
                                            disabled={courseHours.some((ch: CourseHour, i: number) => i !== index && ch.weekday === dayIndex.toString())}
                                        >
                                            {day}
                                        </option>
                                    ))}
                                </select>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => deleteCourseHourSet(index)}
                                        className="ml-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {timeSlots.map((slot: string, hour: number) => (
                                    <label key={hour} className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={courseHour.hours.includes(hour.toString())}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const updatedHours: string[] = e.target.checked
                                                    ? [...courseHour.hours, hour.toString()]
                                                    : courseHour.hours.filter((h: string) => h !== hour.toString());
                                                updateCourseHour(index, 'hours', updatedHours);
                                            }}
                                            className="form-checkbox h-5 w-5 text-blue-600"
                                        />
                                        <span className="ml-2 text-gray-700 dark:text-gray-300">{slot}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addCourseHourSet}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                    >
                        Add Another Course Hour Set
                    </button>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                </form>

                <div className="mt-6">
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        Add Course
                    </button>
                </div>
            </div>
        </div>
    );
}