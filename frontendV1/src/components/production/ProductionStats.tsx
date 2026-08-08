import type { Production } from "../../types/production";

interface Props {
  data: Production[];
}

export default function ProductionStats({
  data,
}: Props) {
  const oil = data.reduce(
    (sum, p) => sum + Number(p.oil_production),
    0
  );

  const gas = data.reduce(
    (sum, p) => sum + Number(p.gas_production),
    0
  );

  const water = data.reduce(
    (sum, p) => sum + Number(p.water_production),
    0
  );

  return (
    <div className="grid gap-4 md:grid-cols-4">

      <div className="rounded-xl bg-white p-6 shadow">
        <p className="text-sm text-slate-500">
          Records
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {data.length}
        </h2>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <p className="text-sm text-slate-500">
          Oil
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {oil.toFixed(2)}
        </h2>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <p className="text-sm text-slate-500">
          Gas
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {gas.toFixed(2)}
        </h2>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <p className="text-sm text-slate-500">
          Water
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {water.toFixed(2)}
        </h2>
      </div>

    </div>
  );
}