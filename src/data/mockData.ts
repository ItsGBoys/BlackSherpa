export interface Material {
  id: string;
  name: string;
  unit: string;
  stock: number;
  minStock: number;
  pricePerUnit: number;
}

export interface BOMItem {
  materialId: string;
  materialName: string;
  qtyPerUnit: number;
  unit: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  bom: BOMItem[];
  routing: string[];
}

export type JobStatus = "draft" | "scheduled" | "in_progress" | "completed" | "cancelled";
export type JobPriority = "high" | "medium" | "low";
export type TaskPhase = "bahan" | "potong" | "produksi" | "qc" | "seal" | "packing" | "pengiriman";

export interface JobTask {
  id: string;
  jobId: string;
  phase: TaskPhase;
  status: "pending" | "in_progress" | "done" | "rework";
  assignedTo?: string;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
  photoUrl?: string;
}

export interface JobOrder {
  id: string;
  productId: string;
  productName: string;
  qty: number;
  status: JobStatus;
  priority: JobPriority;
  progress: number;
  wipPhase: TaskPhase;
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  tasks: JobTask[];
  materialConsumption: { materialName: string; planned: number; actual: number; unit: string }[];
  createdAt: string;
}

// Mock Materials
export const MOCK_MATERIALS: Material[] = [
  { id: "m1", name: "Ripstop Nylon 20D", unit: "meter", stock: 120, minStock: 50, pricePerUnit: 85000 },
  { id: "m2", name: "Silnylon 15D", unit: "meter", stock: 45, minStock: 30, pricePerUnit: 125000 },
  { id: "m3", name: "Dyneema Composite", unit: "meter", stock: 25, minStock: 20, pricePerUnit: 350000 },
  { id: "m4", name: "DAC Featherlite Pole", unit: "set", stock: 60, minStock: 25, pricePerUnit: 450000 },
  { id: "m5", name: "YKK Aquaguard Zipper #3", unit: "pcs", stock: 200, minStock: 100, pricePerUnit: 35000 },
  { id: "m6", name: "Seam Tape 22mm", unit: "roll", stock: 18, minStock: 15, pricePerUnit: 65000 },
  { id: "m7", name: "Cordage Dyneema 2mm", unit: "meter", stock: 300, minStock: 100, pricePerUnit: 12000 },
  { id: "m8", name: "Guyline Tensioner", unit: "pcs", stock: 150, minStock: 50, pricePerUnit: 8000 },
  { id: "m9", name: "Stuff Sack Fabric", unit: "meter", stock: 80, minStock: 30, pricePerUnit: 45000 },
  { id: "m10", name: "Buckle & Hardware Kit", unit: "set", stock: 90, minStock: 40, pricePerUnit: 25000 },
];

// Mock Products with BOM
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1", name: "Tenda Ultralight 2P - Summit", sku: "BS-TUL2P-S", category: "Tenda",
    bom: [
      { materialId: "m1", materialName: "Ripstop Nylon 20D", qtyPerUnit: 8, unit: "meter" },
      { materialId: "m4", materialName: "DAC Featherlite Pole", qtyPerUnit: 1, unit: "set" },
      { materialId: "m5", materialName: "YKK Aquaguard Zipper #3", qtyPerUnit: 3, unit: "pcs" },
      { materialId: "m6", materialName: "Seam Tape 22mm", qtyPerUnit: 0.5, unit: "roll" },
      { materialId: "m7", materialName: "Cordage Dyneema 2mm", qtyPerUnit: 6, unit: "meter" },
      { materialId: "m8", materialName: "Guyline Tensioner", qtyPerUnit: 6, unit: "pcs" },
    ],
    routing: ["potong", "produksi", "qc", "seal", "packing", "pengiriman"],
  },
  {
    id: "p2", name: "Tarp Shelter 3x4 - Ridge", sku: "BS-TRP34-R", category: "Tarp",
    bom: [
      { materialId: "m2", materialName: "Silnylon 15D", qtyPerUnit: 12, unit: "meter" },
      { materialId: "m6", materialName: "Seam Tape 22mm", qtyPerUnit: 0.8, unit: "roll" },
      { materialId: "m7", materialName: "Cordage Dyneema 2mm", qtyPerUnit: 10, unit: "meter" },
      { materialId: "m8", materialName: "Guyline Tensioner", qtyPerUnit: 8, unit: "pcs" },
    ],
    routing: ["potong", "produksi", "qc", "seal", "packing", "pengiriman"],
  },
  {
    id: "p3", name: "Bivak Bag - Alpine", sku: "BS-BVK-ALP", category: "Bivak",
    bom: [
      { materialId: "m3", materialName: "Dyneema Composite", qtyPerUnit: 4, unit: "meter" },
      { materialId: "m5", materialName: "YKK Aquaguard Zipper #3", qtyPerUnit: 1, unit: "pcs" },
      { materialId: "m6", materialName: "Seam Tape 22mm", qtyPerUnit: 0.3, unit: "roll" },
    ],
    routing: ["potong", "produksi", "qc", "seal", "packing", "pengiriman"],
  },
  {
    id: "p4", name: "Rainfly 2P - Storm", sku: "BS-RNF2P-ST", category: "Rainfly",
    bom: [
      { materialId: "m2", materialName: "Silnylon 15D", qtyPerUnit: 6, unit: "meter" },
      { materialId: "m7", materialName: "Cordage Dyneema 2mm", qtyPerUnit: 4, unit: "meter" },
      { materialId: "m8", materialName: "Guyline Tensioner", qtyPerUnit: 4, unit: "pcs" },
    ],
    routing: ["potong", "produksi", "qc", "seal", "packing", "pengiriman"],
  },
];

// WIP PercentAGES
export const WIP_PERCENTAGES: Record<TaskPhase, number> = {
  bahan: 10,
  potong: 25,
  produksi: 55,
  qc: 70,
  seal: 85,
  packing: 95,
  pengiriman: 100,
};

export const PHASE_LABELS: Record<TaskPhase, string> = {
  bahan: "Pengambilan Bahan",
  potong: "Potong",
  produksi: "Produksi",
  qc: "Quality Control",
  seal: "Seal",
  packing: "Packing",
  pengiriman: "Pengiriman",
};

// Mock Job Orders
export const MOCK_JOB_ORDERS: JobOrder[] = [
  {
    id: "JO-2025-001", productId: "p1", productName: "Tenda Ultralight 2P - Summit", qty: 50,
    status: "in_progress", priority: "high", progress: 85, wipPhase: "qc",
    plannedStart: "2025-04-14", plannedEnd: "2025-04-28",
    actualStart: "2025-04-14",
    tasks: [
      { id: "t1", jobId: "JO-2025-001", phase: "bahan", status: "done", completedAt: "2025-04-14" },
      { id: "t2", jobId: "JO-2025-001", phase: "potong", status: "done", completedAt: "2025-04-16" },
      { id: "t3", jobId: "JO-2025-001", phase: "produksi", status: "done", completedAt: "2025-04-20" },
      { id: "t4", jobId: "JO-2025-001", phase: "qc", status: "in_progress" },
      { id: "t5", jobId: "JO-2025-001", phase: "seal", status: "pending" },
      { id: "t6", jobId: "JO-2025-001", phase: "packing", status: "pending" },
      { id: "t7", jobId: "JO-2025-001", phase: "pengiriman", status: "pending" },
    ],
    materialConsumption: [
      { materialName: "Ripstop Nylon 20D", planned: 400, actual: 385, unit: "meter" },
      { materialName: "DAC Featherlite Pole", planned: 50, actual: 50, unit: "set" },
      { materialName: "YKK Aquaguard Zipper #3", planned: 150, actual: 148, unit: "pcs" },
    ],
    createdAt: "2025-04-12",
  },
  {
    id: "JO-2025-002", productId: "p2", productName: "Tarp Shelter 3x4 - Ridge", qty: 100,
    status: "in_progress", priority: "medium", progress: 55, wipPhase: "produksi",
    plannedStart: "2025-04-16", plannedEnd: "2025-05-02",
    actualStart: "2025-04-16",
    tasks: [
      { id: "t8", jobId: "JO-2025-002", phase: "bahan", status: "done", completedAt: "2025-04-16" },
      { id: "t9", jobId: "JO-2025-002", phase: "potong", status: "done", completedAt: "2025-04-19" },
      { id: "t10", jobId: "JO-2025-002", phase: "produksi", status: "in_progress" },
      { id: "t11", jobId: "JO-2025-002", phase: "qc", status: "pending" },
      { id: "t12", jobId: "JO-2025-002", phase: "seal", status: "pending" },
      { id: "t13", jobId: "JO-2025-002", phase: "packing", status: "pending" },
      { id: "t14", jobId: "JO-2025-002", phase: "pengiriman", status: "pending" },
    ],
    materialConsumption: [
      { materialName: "Silnylon 15D", planned: 1200, actual: 680, unit: "meter" },
      { materialName: "Seam Tape 22mm", planned: 80, actual: 42, unit: "roll" },
    ],
    createdAt: "2025-04-14",
  },
  {
    id: "JO-2025-003", productId: "p3", productName: "Bivak Bag - Alpine", qty: 30,
    status: "in_progress", priority: "high", progress: 25, wipPhase: "potong",
    plannedStart: "2025-04-20", plannedEnd: "2025-05-05",
    actualStart: "2025-04-20",
    tasks: [
      { id: "t15", jobId: "JO-2025-003", phase: "bahan", status: "done", completedAt: "2025-04-20" },
      { id: "t16", jobId: "JO-2025-003", phase: "potong", status: "in_progress" },
      { id: "t17", jobId: "JO-2025-003", phase: "produksi", status: "pending" },
      { id: "t18", jobId: "JO-2025-003", phase: "qc", status: "pending" },
      { id: "t19", jobId: "JO-2025-003", phase: "seal", status: "pending" },
      { id: "t20", jobId: "JO-2025-003", phase: "packing", status: "pending" },
      { id: "t21", jobId: "JO-2025-003", phase: "pengiriman", status: "pending" },
    ],
    materialConsumption: [
      { materialName: "Dyneema Composite", planned: 120, actual: 35, unit: "meter" },
    ],
    createdAt: "2025-04-18",
  },
  {
    id: "JO-2025-004", productId: "p4", productName: "Rainfly 2P - Storm", qty: 75,
    status: "scheduled", priority: "low", progress: 10, wipPhase: "bahan",
    plannedStart: "2025-04-25", plannedEnd: "2025-05-10",
    tasks: [
      { id: "t22", jobId: "JO-2025-004", phase: "bahan", status: "in_progress" },
      { id: "t23", jobId: "JO-2025-004", phase: "potong", status: "pending" },
      { id: "t24", jobId: "JO-2025-004", phase: "produksi", status: "pending" },
      { id: "t25", jobId: "JO-2025-004", phase: "qc", status: "pending" },
      { id: "t26", jobId: "JO-2025-004", phase: "seal", status: "pending" },
      { id: "t27", jobId: "JO-2025-004", phase: "packing", status: "pending" },
      { id: "t28", jobId: "JO-2025-004", phase: "pengiriman", status: "pending" },
    ],
    materialConsumption: [
      { materialName: "Silnylon 15D", planned: 450, actual: 0, unit: "meter" },
    ],
    createdAt: "2025-04-20",
  },
  {
    id: "JO-2025-005", productId: "p1", productName: "Tenda Ultralight 2P - Summit", qty: 25,
    status: "completed", priority: "medium", progress: 100, wipPhase: "pengiriman",
    plannedStart: "2025-04-01", plannedEnd: "2025-04-15",
    actualStart: "2025-04-01", actualEnd: "2025-04-14",
    tasks: [
      { id: "t29", jobId: "JO-2025-005", phase: "bahan", status: "done", completedAt: "2025-04-01" },
      { id: "t30", jobId: "JO-2025-005", phase: "potong", status: "done", completedAt: "2025-04-03" },
      { id: "t31", jobId: "JO-2025-005", phase: "produksi", status: "done", completedAt: "2025-04-08" },
      { id: "t32", jobId: "JO-2025-005", phase: "qc", status: "done", completedAt: "2025-04-10" },
      { id: "t33", jobId: "JO-2025-005", phase: "seal", status: "done", completedAt: "2025-04-11" },
      { id: "t34", jobId: "JO-2025-005", phase: "packing", status: "done", completedAt: "2025-04-12" },
      { id: "t35", jobId: "JO-2025-005", phase: "pengiriman", status: "done", completedAt: "2025-04-14" },
    ],
    materialConsumption: [
      { materialName: "Ripstop Nylon 20D", planned: 200, actual: 195, unit: "meter" },
    ],
    createdAt: "2025-03-28",
  },
];
