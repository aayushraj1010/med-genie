'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Plus, Clock, Pill, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { useReminders, Reminder } from '@/hooks/use-reminders';
import { ReminderModal } from './reminder-modal';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function RemindersWidget() {
  const { reminders, isLoading, createReminder, updateReminder, deleteReminder } = useReminders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const { toast } = useToast();

  const handleSave = async (data: Partial<Reminder>) => {
    try {
      if (editingReminder) {
        await updateReminder(editingReminder.id, data);
        toast({ title: 'Reminder updated successfully' });
      } else {
        await createReminder(data);
        toast({ title: 'Reminder created successfully' });
        
        // Request notification permission if not granted
        if ('Notification' in window && Notification.permission !== 'granted') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              toast({ title: 'Notifications enabled!' });
            } else {
              toast({ 
                title: 'Notifications disabled', 
                description: 'You need to enable notifications in your browser to receive alerts.',
                variant: 'destructive'
              });
            }
          });
        }
      }
    } catch (err: any) {
      toast({
        title: 'Error saving reminder',
        description: err.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteReminder(id);
      toast({ title: 'Reminder deleted' });
    } catch (err: any) {
      toast({ title: 'Error deleting reminder', description: err.message, variant: 'destructive' });
    }
  };

  const openCreate = () => {
    setEditingReminder(null);
    setIsModalOpen(true);
  };

  const openEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsModalOpen(true);
  };

  const toggleActive = async (reminder: Reminder) => {
    try {
      await updateReminder(reminder.id, { isActive: !reminder.isActive });
    } catch (err: any) {
      toast({ title: 'Error toggling reminder', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <Card className="shadow-lg border-blue-100 dark:border-blue-900">
      <CardHeader className="flex flex-row items-center justify-between bg-blue-50/50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Health Reminders
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Get browser alerts for medications and tasks
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : reminders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BellOff className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p>No reminders set.</p>
            <Button variant="link" onClick={openCreate} className="mt-2 text-blue-600">
              Create your first reminder
            </Button>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            {reminders.map((reminder) => (
              <div 
                key={reminder.id} 
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  reminder.isActive 
                    ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800' 
                    : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 opacity-70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${reminder.isActive ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'bg-gray-200 text-gray-500 dark:bg-gray-700'}`}>
                    {reminder.dosage ? <Pill className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                  <div>
                    <h4 className={`font-medium ${reminder.isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 line-through'}`}>
                      {reminder.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{reminder.time}</span>
                      <span>•</span>
                      <span>{reminder.frequency}</span>
                      {reminder.dosage && (
                        <>
                          <span>•</span>
                          <span>{reminder.dosage}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleActive(reminder)}>
                        {reminder.isActive ? (
                          <><BellOff className="mr-2 h-4 w-4" /> Disable</>
                        ) : (
                          <><Bell className="mr-2 h-4 w-4" /> Enable</>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEdit(reminder)}>
                        <Edit2 className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(reminder.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingReminder}
      />
    </Card>
  );
}
