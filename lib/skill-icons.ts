import {
  Atom,
  Box,
  Braces,
  Coffee,
  Cpu,
  Database,
  DatabaseBackup,
  FileCode,
  FileCode2,
  FileType2,
  Flame,
  Network,
  Palette,
  PenLine,
  PenTool,
  Route,
  Smartphone,
  Timer,
  ToyBrick,
  Zap,
} from "lucide-react";

export const skillIcons: Record<string, any> = {
  // FRONT-END
  javascript: FileCode2,
  typescript: FileType2,
  react: Atom,
  "next.js": Box,
  html: FileCode,
  css: FileCode,

  // BACK-END
  node: Zap,
  express: Route,
  fastify: Timer,
  java: Coffee,
  python: Cpu,
  php: Braces,

  // MOBILE
  "react native": Smartphone,
  flutter: ToyBrick,

  // DESIGN
  ui: Palette,
  ux: PenTool,
  figma: PenLine,

  // BANCO DE DADOS
  sql: Database,
  mysql: Database,
  postgres: Database,
  mongodb: DatabaseBackup,
  firebase: Flame,

  // OUTROS
  api: Network,
  backend: Cpu,
  frontend: Atom,
  mobile: Smartphone,
};
