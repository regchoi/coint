import { Task } from "gantt-task-react";

type ProjectResponse = {
    idNum: number;
    projectName: string;
    startDate: string;
    endDate: string;
    status: string;
}

type TaskResponse = {
    idNum: number;
    taskName: string;
    startDate: string;
    endDate: string;
    status: string;
    projectName: string;
}

export function convertToGanttTasks(
    projectResponses: ProjectResponse[],
    taskResponses: TaskResponse[]
): Task[] {
    let combinedTasks: Task[] = [];
    let displayOrderCounter = 1;

    console.log(taskResponses)

    projectResponses.forEach((project) => {
        const projectTask: Task = {
            start: new Date(project.startDate),
            end: new Date(project.endDate),
            name: project.projectName,
            id: "Project" + project.idNum,
            progress: 20, // 달성률(임의값으로 설정) TODO : 달성률 계산
            type: "project",
            hideChildren: false,
            displayOrder: displayOrderCounter++,
        };
        combinedTasks.push(projectTask);

        const tasksForProject = taskResponses.filter(
            (task) => task.projectName === project.projectName // Map task.idNum to the appropriate project ID
        );
        tasksForProject.sort((a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );

        tasksForProject.forEach((task, i) => {
            const taskItem: Task = {
                start: new Date(task.startDate),
                end: new Date(task.endDate),
                name: task.taskName,
                id: "Task" + task.idNum,
                progress: 100, // Set progress as needed
                type: "task",
                project: "Project" + project.idNum,
                displayOrder: displayOrderCounter++,
            };
            if (i > 0) {
                taskItem.dependencies = ["Task" + tasksForProject[i - 1].idNum];
            }
            combinedTasks.push(taskItem);
        });
    });
    return combinedTasks;
}


export function initTasks() {
    const currentDate = new Date();
    const tasks: Task[] = [
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            name: "",
            id: "",
            progress: 25,
            type: "project",
            hideChildren: false,
            displayOrder: 1,
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            end: new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                2,
                12,
                28
            ),
            name: "Idea",
            id: "Task 0",
            progress: 45,
            type: "task",
            project: "ProjectSample",
            displayOrder: 2,
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
            name: "Research",
            id: "Task 1",
            progress: 25,
            dependencies: ["Task 0"],
            type: "task",
            project: "ProjectSample",
            displayOrder: 3,
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
            name: "Discussion with team",
            id: "Task 2",
            progress: 10,
            dependencies: ["Task 1"],
            type: "task",
            project: "ProjectSample",
            displayOrder: 4,
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
            name: "Developing",
            id: "Task 3",
            progress: 2,
            dependencies: ["Task 2"],
            type: "task",
            project: "ProjectSample",
            displayOrder: 5,
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
            name: "Review",
            id: "Task 4",
            type: "task",
            progress: 70,
            dependencies: ["Task 1"],
            project: "ProjectSample",
            displayOrder: 6,
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
            name: "Release",
            id: "Task 6",
            progress: currentDate.getMonth(),
            type: "milestone",
            dependencies: ["Task 4"],
            project: "ProjectSample",
            displayOrder: 7,
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
            name: "Party Time",
            id: "Task 9",
            progress: 0,
            isDisabled: true,
            type: "task",
        },
    ];
    return tasks;
}

export function getStartEndDateForProject(tasks: Task[], projectId: string) {
    const projectTasks = tasks.filter(t => t.project === projectId);
    let start = projectTasks[0].start;
    let end = projectTasks[0].end;

    for (let i = 0; i < projectTasks.length; i++) {
        const task = projectTasks[i];
        if (start.getTime() > task.start.getTime()) {
            start = task.start;
        }
        if (end.getTime() < task.end.getTime()) {
            end = task.end;
        }
    }
    return [start, end];
}