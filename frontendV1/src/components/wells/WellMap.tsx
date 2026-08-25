import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import type { LatLngBoundsExpression, LatLngTuple } from "leaflet";
import { MapPin, MapPinOff } from "lucide-react";

import type { Well } from "../../services/well";
import { getWellStatusColor } from "../../utils/wellStatusColor";

export interface WellMapPoint extends Well {
  latitude: string;
  longitude: string;
}

interface WellMapProps {
  wells: Well[];
  selectedWellId?: number | null;
  onMarkerClick?(well: Well): void;
  onViewWell?(well: Well): void;
  loading?: boolean;
  error?: boolean;
  height?: string;
  /** Fallback center used when there are no wells with coordinates yet. */
  defaultCenter?: LatLngTuple;
  defaultZoom?: number;
}

const FALLBACK_CENTER: LatLngTuple = [31.5, 2.5]; // rough Algerian oil-field region, used only when no data exists
const FALLBACK_ZOOM = 5;

function hasCoordinates(well: Well): well is WellMapPoint {
  return (
    well.latitude !== null &&
    well.latitude !== undefined &&
    well.latitude !== "" &&
    well.longitude !== null &&
    well.longitude !== undefined &&
    well.longitude !== ""
  );
}

function FitBounds({ points }: { points: WellMapPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView(
        [Number(points[0].latitude), Number(points[0].longitude)],
        11
      );
      return;
    }

    const bounds: LatLngBoundsExpression = points.map(
      (p) => [Number(p.latitude), Number(p.longitude)] as LatLngTuple
    );

    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points.map((p) => `${p.id}:${p.latitude}:${p.longitude}`).join(",")]);

  return null;
}

export default function WellMap({
  wells,
  selectedWellId,
  onMarkerClick,
  onViewWell,
  loading = false,
  error = false,
  height = "600px",
  defaultCenter = FALLBACK_CENTER,
  defaultZoom = FALLBACK_ZOOM,
}: WellMapProps) {
  const points = useMemo(() => wells.filter(hasCoordinates), [wells]);

  if (error) {
    return (
      <div
        style={{ height }}
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border bg-white text-center shadow-sm"
      >
        <MapPinOff size={40} className="text-red-400" />
        <div>
          <p className="font-medium text-slate-700">
            Couldn't load the well map
          </p>
          <p className="text-sm text-slate-500">
            Please try again in a moment.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center rounded-2xl border bg-white text-slate-500 shadow-sm"
      >
        Loading map...
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div
        style={{ height }}
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border bg-white text-center shadow-sm"
      >
        <MapPin size={40} className="text-slate-300" />
        <div>
          <p className="font-medium text-slate-700">
            No wells with coordinates to display
          </p>
          <p className="text-sm text-slate-500">
            Try a different filter, or add coordinates to a well.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ height }}
      className="overflow-hidden rounded-2xl border bg-white shadow-sm"
    >
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds points={points} />

        {points.map((well) => {
          const isSelected = well.id === selectedWellId;
          const color = getWellStatusColor(well.status);

          return (
            <CircleMarker
              key={well.id}
              center={[Number(well.latitude), Number(well.longitude)]}
              radius={isSelected ? 11 : 8}
              pathOptions={{
                color: "#ffffff",
                weight: 2,
                fillColor: color,
                fillOpacity: 0.9,
              }}
              eventHandlers={{
                click: () => onMarkerClick?.(well),
              }}
            >
              <Popup>
                <div className="min-w-[200px] space-y-2 text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {well.name}
                    </p>
                    <p className="text-xs text-slate-500">{well.code}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                    <span className="text-slate-500">Status</span>
                    <span className="font-medium">{well.status}</span>

                    <span className="text-slate-500">Type</span>
                    <span className="font-medium">{well.well_type}</span>

                    <span className="text-slate-500">Field</span>
                    <span className="font-medium">{well.field_name}</span>

                    <span className="text-slate-500">Lift</span>
                    <span className="font-medium">
                      {well.artificial_lift ?? "-"}
                    </span>

                    <span className="text-slate-500">Coordinates</span>
                    <span className="font-medium">
                      {Number(well.latitude).toFixed(4)},{" "}
                      {Number(well.longitude).toFixed(4)}
                    </span>
                  </div>

                  {onViewWell && (
                    <button
                      onClick={() => onViewWell(well)}
                      className="mt-1 w-full rounded-lg bg-blue-600 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      View Well
                    </button>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
