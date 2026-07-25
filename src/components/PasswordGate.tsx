interface Props {
  children: React.ReactNode;
}

export function PasswordGate({ children }: Props) {
  // Access bypass: immediately render children to disable password gate
  return <>{children}</>;
}
