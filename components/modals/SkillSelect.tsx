"use client";

import { useState } from "react";
import { AVAILABLE_SKILLS } from "@/lib/skills";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface SkillSelectProps {
  selected: string[];
  onChange: (skills: string[]) => void;
}

export default function SkillSelect({ selected, onChange }: SkillSelectProps) {
  const [open, setOpen] = useState(false);

  const toggleSkill = (skill: string) => {
    if (selected.includes(skill)) {
      onChange(selected.filter((s) => s !== skill));
    } else {
      onChange([...selected, skill]);
    }
  };

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Selecionar skills
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-64 max-h-64 overflow-y-auto p-2">
          <div className="flex flex-col gap-2">
            {AVAILABLE_SKILLS.map((skill) => (
              <div
                key={skill}
                className={`cursor-pointer p-2 rounded-md border 
                  ${selected.includes(skill) ? "bg-blue-600 text-white" : "bg-white"}
                `}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Tags selecionadas */}
      <div className="flex flex-wrap gap-2">
        {selected.map((skill) => (
          <Badge
            key={skill}
            className="bg-blue-600 text-white flex items-center gap-1 pr-2"
          >
            {skill}
            <X
              size={14}
              className="cursor-pointer"
              onClick={() => toggleSkill(skill)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
}
