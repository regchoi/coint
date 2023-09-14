import { Task } from "gantt-task-react";

type ProjectResponse = {
    idNum: number;
    projectName: string;
    startDate: string;
    endDate: string;
    status: string;
}

type TaskGroupResponse = {
    idNum: number;
    taskGroupName: string;
    projectsIdNum: number;
}

type TaskResponse = {
    idNum: number;
    taskName: string;
    startDate: string;
    endDate: string;
    status: string;
    projectName: string;
    taskGroupIdNum: number;
}

export function convertToGanttTasks(
    projectResponses: ProjectResponse[],
    taskGroupResponses: TaskGroupResponse[],
    taskResponses: TaskResponse[]
): Task[] {
    let combinedTasks: Task[] = [];
    let displayOrderCounter = 1;

    // Task Group Response를 1차원 배열로 변환
    const flattenedTaskGroupResponses = taskGroupResponses.flat();

    projectResponses.forEach((project) => {
        // Project를 기준으로 Task Group과 Task를 분리
        const projectTask: Task = {
            start: new Date(project.startDate),
            end: new Date(project.endDate),
            name: project.projectName,
            id: "Project" + project.idNum,
            progress: 20, // TODO: Calculate progress
            type: "project",
            hideChildren: false,
            displayOrder: displayOrderCounter++,
        };
        combinedTasks.push(projectTask);

        // Project에 속한 task와 taskGroup들만 추출
        const tasksForProject = taskResponses.filter(task => task.projectName === project.projectName);
        const taskGroupsForProject = flattenedTaskGroupResponses.filter(taskGroup => taskGroup.projectsIdNum === project.idNum);

        // Task Group이 없는 Task를 분리
        const tasksWithoutTaskGroup = tasksForProject.filter(task => task.taskGroupIdNum === null);
        tasksWithoutTaskGroup.forEach((task) => {
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
            combinedTasks.push(taskItem);
        });

        // Task Group이 있는 Task를 분리
        const tasksWithTaskGroup = tasksForProject.filter(task => task.taskGroupIdNum !== null);

        taskGroupsForProject.forEach((taskGroup) => {
            // Task Group에 속한 task들만 추출
            const tasksForTaskGroup = tasksWithTaskGroup.filter(task => task.taskGroupIdNum === taskGroup.idNum);

            if (tasksForTaskGroup.length > 0) {
                // Task Group에 속한 task들중 시작일이 가장 빠른 값 하나만 추출
                tasksForTaskGroup.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

                // Process Task Group as a 'task'
                const taskGroupItem: Task = {
                    start: new Date(tasksForTaskGroup[0].startDate),
                    end: new Date(tasksForTaskGroup[0].startDate),
                    name: taskGroup.taskGroupName,
                    id: "TaskGroup" + taskGroup.idNum,
                    progress: 100, // Set progress as needed
                    type: "task",
                    project: "Project" + project.idNum,
                    displayOrder: displayOrderCounter++,
                };
                combinedTasks.push(taskGroupItem);

                // Process Tasks
                tasksForTaskGroup.forEach((task) => {
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
                    combinedTasks.push(taskItem);
                });
            }
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
        }
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
