interface Props {
  children: any;
}

export function Note({ children }: Props) {
  return (
    <div className="pt-3 pb-3 text-center bg-gray-200 rounded-xl shadow-md">
      {children}
    </div>
  );
}
