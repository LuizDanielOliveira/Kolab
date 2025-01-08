import { Input } from '@chakra-ui/react';

interface Props {
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBar({ placeholder, value, onChange }: Props) {
  return (
    <Input
      placeholder={placeholder || 'Buscar...'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
