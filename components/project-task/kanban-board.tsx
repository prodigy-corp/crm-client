"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/lib/api/tasks";
import {
  closestCorners,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import Link from "next/link";
import { useMemo, useState } from "react";
import { LuCalendar, LuMoreVertical, LuPlus, LuUser } from "react-icons/lu";

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Task["status"]) => void;
}

const COLUMNS: { id: Task["status"]; title: string }[] = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "COMPLETED", title: "Completed" },
  { id: "CANCELLED", title: "Cancelled" },
];

export const KanbanBoard = ({ tasks, onTaskMove }: KanbanBoardProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const tasksByStatus = useMemo(() => {
    return COLUMNS.reduce(
      (acc, col) => {
        acc[col.id] = tasks.filter((t) => t.status === col.id);
        return acc;
      },
      {} as Record<string, Task[]>,
    );
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if we dropped over a column or another task
    let newStatus: Task["status"] | null = null;

    if (COLUMNS.some((col) => col.id === overId)) {
      newStatus = overId as Task["status"];
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) newStatus = overTask.status;
    }

    const activeTask = tasks.find((t) => t.id === activeId);
    if (activeTask && newStatus && activeTask.status !== newStatus) {
      onTaskMove(activeId, newStatus);
    }

    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-[calc(100vh-250px)] gap-6 overflow-x-auto pb-4">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={tasksByStatus[column.id] || []}
          />
        ))}
      </div>
      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: "0.5",
              },
            },
          }),
        }}
      >
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
};

const KanbanColumn = ({
  id,
  title,
  tasks,
}: {
  id: string;
  title: string;
  tasks: Task[];
}) => {
  return (
    <Card className="flex w-80 shrink-0 flex-col border-none bg-muted/30 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-bold tracking-wider uppercase">
            {title}
          </CardTitle>
          <Badge variant="secondary" className="rounded-full">
            {tasks.length}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <LuPlus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 overflow-y-auto p-3">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </CardContent>
    </Card>
  );
};

const TaskCard = ({
  task,
  isOverlay = false,
}: {
  task: Task;
  isOverlay?: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const priorityColors = {
    LOW: "bg-teal-500/10 text-teal-600 border-teal-500/20",
    MEDIUM: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    HIGH: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    URGENT: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`group cursor-grab border-primary/5 transition-all hover:border-primary/20 active:cursor-grabbing ${
        isOverlay ? "bg-background shadow-2xl ring-2 ring-primary/20" : ""
      }`}
      {...attributes}
      {...listeners}
    >
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between">
          <Badge
            className={`text-[10px] font-bold ${priorityColors[task.priority]}`}
            variant="outline"
          >
            {task.priority}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100"
          >
            <LuMoreVertical className="h-3 w-3" />
          </Button>
        </div>

        <div>
          <Link
            href={`/dashboard/tasks/${task.id}`}
            className="line-clamp-2 text-sm font-semibold transition-colors hover:text-primary"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {task.title}
          </Link>
          {task.project && (
            <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
              {task.project.name}
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-primary/5 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <LuUser className="h-3 w-3" />
            <span>{task.assignee?.name || "Unassigned"}</span>
          </div>
          {task.dueDate && (
            <div className="flex items-center gap-1 rounded bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              <LuCalendar className="h-3 w-3" />
              {format(new Date(task.dueDate), "MMM dd")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
