import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPinned } from "lucide-react";

import { useWells } from "../../hooks/useWells";
import { useFields } from "../../hooks/useFields";
import { unwrapList } from "../../types/pagination";
import type { Well } from "../../services/well";

import WellMap from "../../components/wells/WellMap";
import WellMapToolbar from "../../components/wells/WellMapToolbar";
import { getWellStatusColor } from "../../utils/wellStatusColor";
import { WELL_STATUS } from "../../services/well";

export default function MapPage() {
  const [search, setSearch] = useState("");
  const [fieldId, setFieldId] = useState("All");
  const [status, setStatus] = useState("All");
  const [wellType, setWellType] = useState("All");
  const [artificialLift, setArtificialLift] = useState("All");

  const [selectedWellId, setSelectedWellId] = useState<number | null>(null);

  const navigate = useNavigate();

  const {
    data: fieldsResp,
  } = useFields({ page_size: 500 });
  const fields = unwrapList(fieldsResp);

  const {
    data: wellsResp,
    isLoading,
    isError,
  } = useWells({
    page_size: 500,
    search: search || undefined,
    field: fieldId !== "All" ? fieldId : undefined,
    status: status !== "All" ? status : undefined,
    well_type: wellType !== "All" ? wellType : undefined,
    artificial_lift: artificialLift !== "All" ? artificialLift : undefined,
  });

  const wells: Well[] = unwrapList(wellsResp);

  const wellsWithCoords = useMemo(
    () =>
      wells.filter(
        (w) =>
          w.latitude !== null &&
          w.latitude !== undefined &&
          w.latitude !== "" &&
          w.longitude !== null &&
          w.longitude !== undefined &&
          w.longitude !== ""
      ),
    [wells]
  );

  const missingCoordsCount = wells.length - wellsWithCoords.length;

  function handleReset() {
    setSearch("");
    setFieldId("All");
    setStatus("All");
    setWellType("All");
    setArtificialLift("All");
  }

  function handleViewWell(well: Well) {
    navigate(`/wells?wellId=${well.id}`);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <MapPinned size={24} />
        </div>

        <div>
          <h1 className="text-4xl font-bold">Well Map</h1>
          <p className="text-slate-500">
            Explore wells geographically across your fields
          </p>
        </div>
      </div>

      <WellMapToolbar
        search={search}
        onSearch={setSearch}
        fieldId={fieldId}
        onField={setFieldId}
        fields={fields}
        status={status}
        onStatus={setStatus}
        wellType={wellType}
        onWellType={setWellType}
        artificialLift={artificialLift}
        onArtificialLift={setArtificialLift}
        onReset={handleReset}
      />

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm">
        {WELL_STATUS.map((s) => (
          <div key={s} className="flex items-center gap-2 text-sm">
            <span
              className="h-3 w-3 rounded-full border border-white shadow"
              style={{ backgroundColor: getWellStatusColor(s) }}
            />
            <span className="text-slate-600">{s}</span>
          </div>
        ))}

        <div className="ml-auto text-sm text-slate-500">
          Showing {wellsWithCoords.length} of {wells.length} wells
          {missingCoordsCount > 0 && (
            <span className="text-amber-600">
              {" "}
              &middot; {missingCoordsCount} without coordinates hidden
            </span>
          )}
        </div>
      </div>

      <WellMap
        wells={wellsWithCoords}
        selectedWellId={selectedWellId}
        onMarkerClick={(well) => setSelectedWellId(well.id)}
        onViewWell={handleViewWell}
        loading={isLoading}
        error={isError}
        height="650px"
      />
    </div>
  );
}
