import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Reminder } from '@/hooks/use-reminders';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Reminder>) => Promise<void>;
  initialData?: Reminder | null;
}

export function ReminderModal({ isOpen, onClose, onSave, initialData }: ReminderModalProps) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [time, setTime] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setDosage(initialData.dosage || '');
        setFrequency(initialData.frequency);
        setTime(initialData.time);
        setIsActive(initialData.isActive);
      } else {
        setName('');
        setDosage('');
        setFrequency('Daily');
        setTime('09:00');
        setIsActive(true);
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !frequency || !time) return;

    setIsSubmitting(true);
    try {
      await onSave({
        name,
        dosage: dosage || null,
        frequency,
        time,
        isActive,
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Reminder' : 'Create Reminder'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Reminder Name</Label>
            <Input
              id="name"
              placeholder="e.g. Vitamin D, Hydration"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dosage">Dosage / Details (Optional)</Label>
            <Input
              id="dosage"
              placeholder="e.g. 1 pill, 500ml"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="As needed">As needed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          {initialData && (
            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="isActive" className="text-sm font-medium">Active Status</Label>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Reminder'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
