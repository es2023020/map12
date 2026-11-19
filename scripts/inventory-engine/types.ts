export type UnitStatus = "Available" | "Sold" | "Reserved" | "Last Unit";

export interface NormalizedUnit {
  id: string; // Cleaned canonical unit ID (e.g. "V-104", "CH-201", or synthetic key)
  projectSlug: string;
  developerSlug?: string;
  cluster?: string; // Phase, Zone, Building or Cluster name
  type: string; // Apartment, Chalet, Standalone Villa, Townhouse, Twin House, Duplex, Penthouse, etc.
  beds: number;
  finishing: string; // Finished, Core & Shell, Semi Finished, etc.
  areaSqm: number;
  areaNote?: string; // Floor, Garden sqm, Roof sqm
  view?: string;
  priceEGP: number;
  deliveryNote?: string;
  paymentPlan?: string;
  status: UnitStatus;
  rawUnitId?: string;
  fingerprint: string; // Deterministic deduplication key
}

export type DocumentType =
  | "MASTER_INVENTORY"
  | "PROJECT_INVENTORY"
  | "FACT_SHEET"
  | "REJECTED";

export interface DocumentClassification {
  accepted: boolean;
  documentType: DocumentType;
  developerSlug?: string;
  projectSlug?: string;
  detectedDate?: string;
  confidence: number;
  rejectionReason?: string;
}

export type TextActionIntent =
  | "MARK_PROJECT_SOLD_OUT"
  | "MARK_UNITS_SOLD"
  | "ADD_OR_UPDATE_UNIT"
  | "BULK_TEXT_INVENTORY"
  | "NEW_LAUNCH"
  | "UNREGISTERED_PROJECT_DISCOVERY"
  | "PAYMENT_PLAN_UPDATE"
  | "IRRELEVANT";

export interface DiscoveredProject {
  id: string;
  timestamp: string;
  source: string;
  developerSlug: string;
  developerName: string;
  suggestedName: string;
  suggestedSlug: string;
  destination: string;
  priceFromM?: number;
  types: string[];
  unitSizes?: string;
  paymentPlan?: string;
  deliveryYear?: number;
  blurb?: string;
  rawText: string;
  units?: Partial<NormalizedUnit>[];
  status: "PENDING_APPROVAL" | "APPROVED" | "DISMISSED";
}

export interface TextMessageAction {
  intent: TextActionIntent;
  developerSlug?: string;
  projectSlug?: string;
  projectName?: string;
  unitIds: string[];
  unitData?: Partial<NormalizedUnit>;
  unitsData?: Partial<NormalizedUnit>[];
  launchData?: Partial<DiscoveredProject>;
  discoveredProject?: DiscoveredProject;
  confidence: number;
  rawText: string;
  reason?: string;
}

export interface AnomalyWarning {
  level: "WARNING" | "CRITICAL";
  field: string;
  unitId?: string;
  message: string;
  value?: any;
}

export interface DiffReport {
  developerSlug: string;
  projectSlug: string;
  sourceFileOrMsg: string;
  timestamp: string;
  totalPreviouslyAvailable: number;
  totalCurrentlyAvailable: number;
  unitsAdded: number;
  unitsUpdated: number;
  unitsMarkedSold: number;
  isProjectSoldOut: boolean;
  anomalies: AnomalyWarning[];
  passedSanityCheck: boolean;
}

export interface AuditLogEntry {
  timestamp: string;
  source: "WHATSAPP_DOC" | "WHATSAPP_TEXT" | "MANUAL_FILE";
  sourceId: string;
  developerSlug: string;
  projectsAffected: string[];
  diffs: DiffReport[];
  status: "APPLIED" | "QUARANTINED" | "REJECTED";
}
