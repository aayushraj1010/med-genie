"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Globe } from "lucide-react";

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select
        value={i18n.language}
        onValueChange={(value) => {
          i18n.changeLanguage(value);
        }}
      >
        <SelectTrigger className="w-[110px] h-8 text-xs border-none bg-transparent hover:bg-accent hover:text-accent-foreground focus:ring-0">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="hi">हिन्दी</SelectItem>
          <SelectItem value="bn">বাংলা</SelectItem>
          <SelectItem value="ta">தமிழ்</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
