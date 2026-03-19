import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock, AlertCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Reminder } from "@/types";
import { useStore } from "@/store/useStore";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { cn } from "@/lib/utils";

import { ReminderDetailsModal } from "./ReminderDetailsModal";

export function ReminderCard({ reminder }: { reminder: Reminder }) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toggleReminder, deleteReminder, categories } = useStore();
  
  const categoryData = categories.find(c => c.id === reminder.category) || { name: 'Unknown', color: 'neutral' as any };
  
  const dueDate = new Date(reminder.dueDate);
  // Compare without time component
  const todayStr = new Date().toISOString().substring(0, 10);
  const dueStr = reminder.dueDate.substring(0, 10);
  const overdue = dueStr < todayStr && !reminder.isCompleted;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        onClick={() => setIsDetailsOpen(true)}
        className={cn(
          "p-4 transition-all hover:shadow-md group relative overflow-hidden cursor-pointer",
          reminder.isCompleted ? "opacity-60 bg-gray-50" : "bg-white",
          overdue && "border-danger/30 bg-danger/5"
      )}>
        {overdue && (
          <div className="absolute top-0 left-0 w-1 h-full bg-danger" />
        )}
        {reminder.isCompleted && (
          <div className="absolute top-0 left-0 w-1 h-full bg-success" />
        )}
        
        <div className="flex items-start gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); toggleReminder(reminder.id); }}
            className={cn(
              "mt-0.5 flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all active:scale-95",
              reminder.isCompleted 
                ? "bg-success border-success text-white" 
                : "border-gray-300 hover:border-primary text-transparent hover:text-primary/20 bg-white"
            )}
          >
            <Check className="h-4 w-4" />
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={cn(
                "font-semibold truncate text-base",
                reminder.isCompleted && "line-through text-gray-500"
              )}>
                {reminder.title}
              </h3>
              {reminder.amount !== undefined && !isNaN(reminder.amount) && (
                <span className="font-bold text-foreground shrink-0">
                  ${Number(reminder.amount).toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <Badge variant={categoryData.color}>
                {categoryData.name}
              </Badge>
              
              <div className={cn(
                "flex items-center gap-1",
                overdue && "text-danger font-medium"
              )}>
                {overdue ? <AlertCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                <span>{format(dueDate, 'MMM d, yyyy')}</span>
              </div>
              
              {reminder.recurring !== 'none' && (
                <span className="capitalize px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600">
                  ↻ {reminder.recurring}
                </span>
              )}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.stopPropagation(); deleteReminder(reminder.id); }}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-danger hover:bg-danger/10 -mt-1 -mr-1"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <ReminderDetailsModal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        reminder={reminder} 
      />
    </motion.div>
  );
}
