"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  PiUserCircleThin,
  PiSealCheckLight,
  //PiFarmLight,
} from "react-icons/pi";

import { LayoutContainer } from "@/components/LayoutContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/cardContent";
import DatePicker from "@/components/ui/datePicker";

import { useGetDashboardData } from "@/hooks/useGetDashboardData/useGetDashboardData";
import { Analityc } from "@/icons/Analityc";
//import { Taxa } from "@/icons/Taxa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const DashboardUserLayout = () => {
  const { data, isLoading } = useGetDashboardData();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { reset } = useForm<{ date: Date | null }>({
    defaultValues: { date: null },
  });

  const clearFilter = () => {
    reset({ date: null });
    setSelectedDate(null);
  };

  const getIndicador = (tipo: string) => {
    if (!selectedDate) {
      return (
        data?.porIndicadores.find((i) => i.tipo === tipo) || {
          valor: "0",
          porcentagem: "0",
        }
      );
    }

    const filtrado =
      data?.infoPorDias.filter((d) => {
        const dia = new Date(d.dia);
        return (
          dia.getDate() === selectedDate.getDate() &&
          dia.getMonth() === selectedDate.getMonth() &&
          dia.getFullYear() === selectedDate.getFullYear()
        );
      }) || [];

    const totalSolicitacoes = filtrado.reduce(
      (acc, curr) => acc + Number(curr.solicitacoes ?? 0),
      0
    );

    let valor = 0;

    switch (tipo) {
      case "numeroSolicitacoesEligibilidade":
        valor = filtrado.reduce(
          (acc, curr) => acc + Number(curr.solicitacoes ?? 0),
          0
        );
        break;

      case "numeroPropriedadesElegiveis":
        valor = filtrado.reduce(
          (acc, curr) => acc + Number(curr.propriedades_elegiveis ?? 0),
          0
        );
        break;

      case "numeroAquisicoesVoucher":
        valor = filtrado.reduce(
          (acc, curr) => acc + Number(curr.compra_voucher ?? 0),
          0
        );
        break;

      case "numeroPropriedadeNaoElegiveis":
        const total = filtrado.reduce(
          (acc, curr) => acc + Number(curr.solicitacoes ?? 0),
          0
        );
        const elegiveis = filtrado.reduce(
          (acc, curr) => acc + Number(curr.propriedades_elegiveis ?? 0),
          0
        );
        valor = total - elegiveis;
        break;

      default:
        valor = 0;
    }

    const porcentagem =
      totalSolicitacoes && tipo !== "numeroSolicitacoesEligibilidade"
        ? ((valor / totalSolicitacoes) * 100).toFixed(2)
        : "0";

    return {
      valor: String(valor),
      porcentagem,
    };
  };

  const chartData =
    data?.infoPorDias
      .filter((d) => {
        if (!selectedDate) return true;
        const dia = new Date(d.dia);
        return (
          dia.getDate() === selectedDate.getDate() &&
          dia.getMonth() === selectedDate.getMonth() &&
          dia.getFullYear() === selectedDate.getFullYear()
        );
      })
      .map((d) => ({
        date: new Date(d.dia).toLocaleDateString("pt-BR"),
        solicitacoes: Number(d.solicitacoes),
        vouchers: Number(d.compra_voucher),
        elegiveis: Number(d.propriedades_elegiveis),
      })) || [];

  const customMenuItems = [
    {
      label: "Home",
      href: "/dashboardUser",
      icon: <Analityc />,
    },
    {
      label: "Usuários",
      href: "/dashboardUser/users",
      icon: <PiUserCircleThin size={44} />,
    },
    {
      label: "Elegibilidade",
      href: "/dashboardUser/elegibility",
      icon: <PiSealCheckLight size={44} />,
    },
    /*{
      label: "Propriedades",
      href: "/dashboardUser/properties",
      icon: <PiFarmLight size={44} />,
    },
    {
      label: "Multas",
      href: "/multas",
      icon: <Taxa className="text-current" />,
    },
    */
  ];

  if (isLoading) {
    return (
      <LayoutContainer
        title="Dashboard de acompanhamento Geral"
        menuItems={customMenuItems}
      >
        <div className="p-8 text-center">Carregando...</div>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer
      title="Dashboard de acompanhamento Geral"
      menuItems={customMenuItems}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col items-start mb-6">
          <div className="text-[#0A3503] font-semibold">Data:</div>
          <DatePicker
            defaultValue={new Date()}
            value={selectedDate}
            onChange={setSelectedDate}
          />
        </div>
        <Button
          type="submit"
          variant="danger"
          className="mt-4"
          onClick={clearFilter}
        >
          Limpar
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center bg-[#F1F7F3]">
          <CardContent>
            <h3 className="text-sm">Nº de Solicitações de Elegibilidade</h3>
            <p className="text-4xl font-bold text-[#175912]">
              {getIndicador("numeroSolicitacoesEligibilidade").valor}
            </p>
          </CardContent>
        </Card>

        <Card className="text-center bg-[#F1F7F3]">
          <CardContent>
            <h3 className="text-sm">Nº de Propriedades Elegíveis</h3>
            <p className="text-4xl font-bold text-[#175912]">
              {getIndicador("numeroPropriedadesElegiveis").valor}
            </p>
            <p className="text-xs mt-1">
              {getIndicador("numeroPropriedadesElegiveis").porcentagem}% das
              Solicitações
            </p>
          </CardContent>
        </Card>

        <Card className="text-center bg-[#F1F7F3]">
          <CardContent>
            <h3 className="text-sm">Nº de Aquisições de Voucher</h3>
            <p className="text-4xl font-bold text-[#175912]">
              {getIndicador("numeroAquisicoesVoucher").valor}
            </p>
            <p className="text-xs mt-1">
              {getIndicador("numeroAquisicoesVoucher").porcentagem}% das
              Solicitações
            </p>
          </CardContent>
        </Card>

        <div className="col-span-2 bg-white rounded-xl p-4 shadow">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="solicitacoes"
                stroke="#8B5CF6"
                name="Solicitações"
              />
              <Line
                type="monotone"
                dataKey="vouchers"
                stroke="#EC4899"
                name="Aquisição de voucher"
              />
              <Line
                type="monotone"
                dataKey="elegiveis"
                stroke="#22D3EE"
                name="Propriedades elegíveis"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-4">
          {/*
          <Card className="text-center bg-[#F1F7F3]">
            <CardContent>
              <h3 className="text-sm">Nº de Vouchers Frigorífico</h3>
              <p className="text-4xl font-bold text-[#175912]">40</p>
              <p className="text-xs mt-1">22% dos Elegíveis</p>
            </CardContent>
          </Card>
          */}

          <Card className="text-center bg-[#F1F7F3]">
            <CardContent>
              <h3 className="text-sm">Nº de Propriedades Não Elegíveis</h3>
              <p className="text-4xl font-bold text-[#175912]">
                {getIndicador("numeroPropriedadeNaoElegiveis").valor}
              </p>
              <p className="text-xs mt-1">
                {getIndicador("numeroPropriedadeNaoElegiveis").porcentagem}% das
                Solicitações
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <a href="#" className="text-[#175912] font-semibold">
          Voltar
        </a>
      </div>
    </LayoutContainer>
  );
};
