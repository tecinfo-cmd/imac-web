import { FC, useState } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modals/modal";
import { Modal as CustomModal } from "@/layouts/DashboardUser/Properties/[id]/SelfInspection/components/Modal";

import { yup } from "@/config/yup";
import {
  useAbattoirElegibilities,
  useCreateProdutor,
} from "@/hooks/useAbattoirElegibilities/useAbattoirElegibilities";
import { useAbattoirUser } from "@/hooks/useAbattoirElegibilities/useAbattoirElegibilities";
import { maskCPF } from "@/utils/maskCPF";
import { maskPhone } from "@/utils/maskPhone";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

const customModalSchema = yup.object().shape({
  cpf: yup.string().required("CPF obrigatório").min(11, "CPF inválido"),
  nome: yup.string().required("Nome obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail obrigatório"),
  telefone: yup.string().required("Telefone obrigatório"),
});

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  id: number | null;
  cpfCnpj?: string;
  carFederal?: string;
}

const formatDateTime = (value: string) => {
  const date = new Date(value);
  const data = date.toLocaleDateString("pt-BR");
  const hora = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${data} - ${hora}`;
};

export const ElegibilityAbattoirDetail: FC<Props> = ({
  isOpen,
  onOpenChange,
  onClose,
  id,
  cpfCnpj,
  carFederal,
}) => {
  const [showForm, setShowForm] = useState(false);

  const {
    control: modalControl,
    handleSubmit: handleModalSubmit,
    reset: resetModal,
  } = useForm({
    resolver: yupResolver(customModalSchema),
    mode: "onChange",
    defaultValues: {
      cpf: "",
      nome: "",
      email: "",
      telefone: "",
    },
  });

  const mutation = useCreateProdutor({
    onSuccess: () => {
      resetModal();
      setShowForm(false);
      onClose();
      toast.success("Produtor cadastrado com sucesso.");
    },
    onError: () => {
      toast.error("Erro ao cadastrar produtor. Tente novamente.");
    },
  });

  const { data: abattoirUser } = useAbattoirUser();

  // Busca os dados de elegibilidade pelo id
  const { data, isLoading } = useAbattoirElegibilities({ id }, 1, 0);

  // Extrai o item correto do array retornado
  const item = data?.data?.find((el: any) => el.id === id);

  if (isLoading || !item) return null;

  const retorno = item?.retornoAgrotools ?? {};

  return (
    <>
      <Modal
        className="bg-[#DFEEE5] border-[1px] border-[#cac8c8]"
        isOpen={isOpen && !showForm}
        onOpenChange={onOpenChange}
        onClose={onClose}
      >
        <div className="text-[#0A3503] space-y-2">
          <h2 className="text-center font-bold text-xl">ELEGIBILIDADE</h2>

          <div>
            <strong className="text-[#21801A]">Nome da Propriedade</strong>
            <br />
            {item.nomePropriedade}
          </div>
          {cpfCnpj && (
            <div>
              <strong className="text-[#21801A]">CPF do solicitante</strong>
              <br />
              {cpfCnpj}
            </div>
          )}
          <div>
            <strong className="text-[#21801A]">Telefone do solicitante</strong>
            <br />
            {item.telefone}
          </div>
          <div>
            <strong className="text-[#21801A]">E-mail do Solicitante</strong>
            <br />
            {item.email}
          </div>
          <div>
            <strong className="text-[#21801A]">
              Data / hora da Solicitação
            </strong>
            <br />
            {formatDateTime(item.dataCriacao)}
          </div>

          <div className="pt-2">
            <strong className="text-[#21801A]">
              Resultado da Elegibilidade
            </strong>
            <ul className="list-disc ml-5">
              {carFederal && (
                <li>
                  CAR: <span className="text-black">{carFederal}</span>
                </li>
              )}
              {retorno.deteccoes && retorno.deteccoes.length > 0 ? (
                retorno.deteccoes.map((detec: any) => (
                  <li key={detec.id}>
                    {detec.tipo}:{" "}
                    <strong className="text-black">{detec.area_ha}</strong>
                  </li>
                ))
              ) : (
                <li>
                  <span className="text-black ml-2">N/A</span>
                </li>
              )}

              <li>
                Sobreposição com área de RL ou APP:
                <span className="text-black">
                  {retorno?.hasDocuments === false ? "Não" : "Sim"}
                </span>
              </li>
              <li>
                Propriedade:
                <strong>
                  <span className="text-black">
                    {retorno.isEligible === true
                      ? " ELEGÍVEL "
                      : " NÃO ELEGÍVEL "}
                  </span>
                </strong>
                <span>a participar do PREM</span>
              </li>
              <li>
                Área de desmatamento total:
                <span className="text-black">
                  {retorno?.areas_desmatamento_total ?? "N/A"}
                </span>
              </li>
              <li>
                Número de Módulos Fiscais:
                <span className="text-black">
                  {retorno?.modulo_fiscal ?? "N/A"}
                </span>
              </li>
              <li>
                <strong>
                  Valor da multa indenizatória: R$
                  <span className="text-black">
                    {retorno?.vlr_multa !== undefined
                      ? Number(retorno.vlr_multa).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "N/A"}
                  </span>
                </strong>
              </li>
            </ul>
          </div>
          <div className="mt-2 flex justify-center">
            <Button onClick={() => setShowForm(true)}>
              Cadastrar Propriedade
            </Button>
          </div>
        </div>
      </Modal>

      <CustomModal.Container
        isOpen={showForm}
        className="border-2 border-green-700 rounded-lg"
        onClose={() => {
          resetModal();
          setShowForm(false);
          onClose();
        }}
      >
        <CustomModal.Header className="text-black">
          Cadastro de Usuário Produtor 
        </CustomModal.Header>
        <CustomModal.Body>
          <form
            onSubmit={handleModalSubmit((values) => {
              const payload: any = {
                ...values,
                idFrigorifico: Number(abattoirUser?.id),
                idSolicitacao: Number(item.id),
              };
              mutation.mutate(payload);
            })}
          >
            <Input
              name="cpf"
              label=" CPF do Produtor"
              placeholder="Digite o CPF do Produtor"
              control={modalControl}
              mask={maskCPF}
            />
            <Input
              name="nome"
              label=" Nome do Produtor"
              placeholder="Digite o Nome do Produtor"
              control={modalControl}
            />
            <Input
              name="email"
              label=" E-mail de usuario"
              placeholder="Digite o E-mail do usuario"
              control={modalControl}
            />
            <Input
              name="telefone"
              label=" Telefone"
              placeholder="Digite o Telefone"
              control={modalControl}
              mask={maskPhone}
            />

            <div className="flex justify-center mt-4">
              <Button type="submit" variant="green">
                Salvar
              </Button>
            </div>
          </form>
        </CustomModal.Body>
      </CustomModal.Container>
    </>
  );
};
