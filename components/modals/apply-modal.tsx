"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import SkillSelect from "@/components/modals/SkillSelect";


interface ApplyModalProps {
  open: boolean;
  onClose: () => void;
  projectName: string;
  projectSkills: string[];
  hasApplied?: boolean;
  onSubmit: (data: any) => void;
}

export default function ApplyModal({ open, onClose, projectSkills, onSubmit, projectName, hasApplied = false }: ApplyModalProps) {
  const [description, setDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [extraSkill, setExtraSkill] = useState("");
  const [deadlineAgreement, setDeadlineAgreement] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addExtraSkill = () => {
    if (!extraSkill.trim()) return;
    setSelectedSkills((prev) => [...prev, extraSkill.trim()]);
    setExtraSkill("");
  };

  const handleSubmit = () => {
    onSubmit({ description, skills: selectedSkills, deadlineAgreement });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {hasApplied ? "Candidatura Já Enviada" : "Candidatar-se ao Projeto"}
          </DialogTitle>

          {/* O texto simples no DialogDescription */}
          <DialogDescription>
            {hasApplied
              ? "Você já enviou uma candidatura para este projeto."
              : "Preencha as informações abaixo para enviar sua candidatura."
            }
          </DialogDescription>

          {/* Aqui sim divs são permitidas */}
          <div className="text-sm text-gray-500 -mt-2">
            Projeto: <span className="font-semibold">{projectName}</span>
          </div>
        </DialogHeader>


        {/* Descrição */}
        <div className="space-y-2 mt-4">
          <label className="font-medium text-sm">Descrição do serviço</label>
          <Textarea
            placeholder="Explique como você pretende executar este projeto..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        {/* Skills exigidas */}
        <div className="mt-4">
          <p className="font-medium text-sm mb-2">Selecione as skills exigidas</p>
          <div className="flex flex-wrap gap-2">
            {projectSkills.map((skill) => (
              <Badge
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`cursor-pointer px-3 py-1 rounded-full text-sm transition-all ${selectedSkills.includes(skill) ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Selecionar skills extras */}
        <div className="mt-4 space-y-2">
          <label className="font-medium text-sm">Skills adicionais (opcional)</label>
          <SkillSelect
            selected={selectedSkills}
            onChange={(value) => setSelectedSkills(value)}
          />
        </div>


        {/* Prazo */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={deadlineAgreement}
            onChange={(e) => setDeadlineAgreement(e.target.checked)}
          />
          <label className="text-sm">Estou de acordo com o prazo estipulado no projeto.</label>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-3">
          {hasApplied ? (
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 transition text-white">Voltar</Button>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 transition text-white">Enviar candidatura</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
