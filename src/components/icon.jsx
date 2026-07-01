import {
  Grid3x3,
  Layers,
  ListEnd,
  Link2,
  Hash,
  ListTree,
  GitBranch,
  Network,
  ArrowUpDown,
  Search,
  Binary,
} from "lucide-react";

// Maps catalog icon names (plain strings) to lucide-react components, so the
// topic catalog can stay serializable data.
const icons = {
  Grid3x3,
  Layers,
  ListEnd,
  Link2,
  Hash,
  ListTree,
  GitBranch,
  Network,
  ArrowUpDown,
  Search,
  Binary,
};

export function Icon({ name, ...props }) {
  const LucideIcon = icons[name] ?? Binary;
  return <LucideIcon {...props} />;
}
