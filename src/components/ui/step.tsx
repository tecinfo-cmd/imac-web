import { JSX } from "react";

interface StepProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

export default function Step({ icon, title, description }: StepProps) {
  return (
    <div className="flex flex-col items-center text-center mb-6">
      <div className="bg-green-600 p-3 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-800 mt-2">{title}</h3>
      <p className="text-sm text-gray-600 mt-1 max-w-xs">{description}</p>
    </div>
  );
}
