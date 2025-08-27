import Link from "next/link";
import { PiWarningFill } from "react-icons/pi";

export default function ErrorPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-red-500">
        <PiWarningFill size={76} className="text-red-500" />
        <p>Acesso Restrito</p>
      
      <div className="mt-6">
        <p> A sua conta não tem as permissões necessárias para visualizar este recurso.</p>
        
      </div>

      <div className="font-bold mt-10"><p>Código do Erro: 403 (Proibido) </p></div>
      <Link href="dashboard/properties" className="mt-32 hover:underline">
        Voltar 
      </Link>
      </div>
    </>
  );
}
