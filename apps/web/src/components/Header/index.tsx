interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <div className="flex items-center">
      <h1 className="text-lg font-bold tracking-tight" style={{ color: "#000000", letterSpacing: "-0.01em" }}>
        {title}
      </h1>
    </div>
  );
}
