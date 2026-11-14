"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Unit } from "@/types/database";

export interface UnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    unit_number: number;
    title: string;
    description?: string;
  }) => Promise<void>;
  unit?: Unit | null;
  suggestedUnitNumber?: number;
}

export function UnitModal({
  isOpen,
  onClose,
  onSave,
  unit,
  suggestedUnitNumber = 1,
}: UnitModalProps) {
  const [unitNumber, setUnitNumber] = React.useState<number>(suggestedUnitNumber);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const wasOpenRef = React.useRef(false);
  const editingUnitIdRef = React.useRef<string | undefined>(unit?.id);

  React.useEffect(() => {
    const isNewOpen = isOpen && !wasOpenRef.current;
    const unitChanged = isOpen && unit?.id !== editingUnitIdRef.current;

    if (isNewOpen || unitChanged) {
      if (unit) {
        setUnitNumber(unit.unit_number);
        setTitle(unit.title);
        setDescription(unit.description || "");
      } else {
        setUnitNumber(suggestedUnitNumber);
        setTitle("");
        setDescription("");
      }
      setError("");
      editingUnitIdRef.current = unit?.id;
    }

    wasOpenRef.current = isOpen;
  }, [isOpen, unit?.id, suggestedUnitNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Unit title is required");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await onSave({
        id: unit?.id,
        unit_number: Number(unitNumber),
        title: title.trim(),
        description: description.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save unit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={unit ? "Edit Unit" : "Add Syllabus Unit"}
      description="Define a unit/module to organize study materials, notes, and topics."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-1">
            <Input
              id="unit-number"
              type="number"
              min={1}
              label="Unit #"
              value={unitNumber}
              onChange={(e) => setUnitNumber(parseInt(e.target.value) || 1)}
              required
            />
          </div>
          <div className="col-span-3">
            <Input
              id="unit-title"
              label="Unit Title"
              placeholder="e.g. Relational Model & Normalization"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Topics / Description
          </label>
          <textarea
            className="flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Key topics (e.g. 1NF, 2NF, 3NF, BCNF, Functional Dependencies)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {unit ? "Update Unit" : "Add Unit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

