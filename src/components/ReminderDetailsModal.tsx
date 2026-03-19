"use client";

import { useStore } from "@/store/useStore";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Reminder } from "@/types";
import { format } from "date-fns";
import { ExternalLink, Calendar, Repeat, MessageSquare, CreditCard, DollarSign } from "lucide-react";
import { Badge } from "./ui/Badge";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reminder: Reminder | null;
}

export function ReminderDetailsModal({ isOpen, onClose, reminder }: Props) {
  const { categories } = useStore();
  
  if (!reminder) return null;

  const categoryData = categories.find(c => c.id === reminder.category) || { name: 'Unknown', color: 'neutral' as any };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reminder Details">
      <div className="flex flex-col gap-6 pt-2">
        {/* Header Info */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{reminder.title}</h2>
            <div className="flex items-center gap-2">
              <Badge variant={categoryData.color}>{categoryData.name}</Badge>
              {reminder.autoPay && (
                <Badge variant="info">Auto-Pay Active</Badge>
              )}
              {reminder.isCompleted && (
                <Badge variant="success">Completed</Badge>
              )}
            </div>
          </div>
          {reminder.amount && (
            <div className="text-right">
              <span className="block text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Amount</span>
              <span className="text-2xl font-bold text-foreground flex items-center justify-end">
                <DollarSign className="w-5 h-5 text-gray-400" />
                {reminder.amount.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" /> Due Date
            </span>
            <span className="text-sm font-medium text-gray-900">
              {format(new Date(reminder.dueDate), "EEEE, MMM do yyyy")}
            </span>
          </div>
          
          <div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              <Repeat className="w-4 h-4" /> Recurring
            </span>
            <span className="text-sm font-medium text-gray-900 capitalize">
              {reminder.recurring}
            </span>
          </div>
          
          {reminder.lateFee && (
            <div className="col-span-2 pt-2 mt-2 border-t border-gray-200/60">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-danger uppercase tracking-wider mb-1">
                Potential Late Fee
              </span>
              <span className="text-sm font-medium text-gray-900">
                ${reminder.lateFee.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Notes & URLs */}
        {(reminder.notes || reminder.url) && (
          <div className="flex flex-col gap-4">
            {reminder.notes && (
              <div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  <MessageSquare className="w-4 h-4" /> Notes
                </span>
                <p className="text-sm text-gray-700 bg-white border border-gray-200 p-3 rounded-xl whitespace-pre-wrap leading-relaxed shadow-sm">
                  {reminder.notes}
                </p>
              </div>
            )}
            
            {reminder.url && (
              <div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  <ExternalLink className="w-4 h-4" /> Payment Link
                </span>
                <a 
                  href={reminder.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium bg-primary/5 hover:bg-primary/10 transition-colors p-3 rounded-xl border border-primary/20"
                >
                  <CreditCard className="w-4 h-4" />
                  {reminder.url}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose} variant="secondary">
            Close Details
          </Button>
        </div>
      </div>
    </Modal>
  );
}
