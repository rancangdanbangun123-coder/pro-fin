// ─── Procurement Flow Definitions ──────────────────────────────────────────────
// Centralized configuration for the 3 procurement types

export const PROCUREMENT_TYPES = {
    major: {
        key: 'major',
        label: 'Pengadaan Umum',
        description: 'Alur lengkap untuk pengadaan material bernilai besar (≥ Rp 10 Juta)',
        icon: 'shopping_cart',
        color: 'text-primary bg-primary/10 border-primary/20',
        flow: ['pr', 'po', 'invoice', 'do', 'evaluation', 'done'],
    },
    minor: {
        key: 'minor',
        label: 'Pengadaan Kecil',
        description: 'Alur ringkas untuk pengadaan kecil (< Rp 10 Juta). User beli langsung, lalu lapor.',
        icon: 'receipt_long',
        color: 'text-orange-600 bg-orange-50 border-orange-200',
        flow: ['pr', 'po', 'report', 'done'],
    },
    asset: {
        key: 'asset',
        label: 'Pengadaan Aset',
        description: 'Alur khusus aset tetap dengan evaluasi sertifikasi & garansi.',
        icon: 'inventory_2',
        color: 'text-purple-600 bg-purple-50 border-purple-200',
        flow: ['pr', 'po', 'invoice', 'do', 'asset_eval', 'done'],
    },
};

// All possible column definitions (superset used by the Kanban board)
export const ALL_COLUMNS = {
    pr: { id: 'pr', title: 'PR (Permintaan)', color: 'slate', dotColor: 'bg-slate-400' },
    po: { id: 'po', title: 'PO (Pesanan)', color: 'primary', dotColor: 'bg-primary' },
    invoice: { id: 'invoice', title: 'Invoice', color: 'orange', dotColor: 'bg-orange-500' },
    do: { id: 'do', title: 'DO (Diterima)', color: 'teal', dotColor: 'bg-teal-400' },
    evaluation: { id: 'evaluation', title: 'Evaluasi', color: 'yellow', dotColor: 'bg-yellow-400' },
    report: { id: 'report', title: 'Laporan', color: 'amber', dotColor: 'bg-amber-500' },
    asset_eval: { id: 'asset_eval', title: 'Evaluasi Aset', color: 'purple', dotColor: 'bg-purple-500' },
    done: { id: 'done', title: 'Selesai', color: 'green', dotColor: 'bg-green-500' },
};

// The column order displayed on the board (uses the main 6 + report + asset_eval hidden until needed)
export const BOARD_COLUMN_ORDER = ['pr', 'po', 'invoice', 'do', 'evaluation', 'done'];

// Check if a move is valid for a given procurement type
export function isValidMove(procurementType, fromPhase, toPhase) {
    const type = PROCUREMENT_TYPES[procurementType] || PROCUREMENT_TYPES.major;
    const flow = type.flow;
    const fromIdx = flow.indexOf(fromPhase);
    const toIdx = flow.indexOf(toPhase);

    // Both phases must exist in this flow
    if (fromIdx === -1 || toIdx === -1) return false;

    // Allow forward (next step) or backward (previous step)
    return Math.abs(toIdx - fromIdx) === 1;
}

// Get the next phase for a given item
export function getNextPhase(procurementType, currentPhase) {
    const type = PROCUREMENT_TYPES[procurementType] || PROCUREMENT_TYPES.major;
    const flow = type.flow;
    const idx = flow.indexOf(currentPhase);
    if (idx === -1 || idx >= flow.length - 1) return null;
    return flow[idx + 1];
}

// Get the previous phase for a given item
export function getPrevPhase(procurementType, currentPhase) {
    const type = PROCUREMENT_TYPES[procurementType] || PROCUREMENT_TYPES.major;
    const flow = type.flow;
    const idx = flow.indexOf(currentPhase);
    if (idx <= 0) return null;
    return flow[idx - 1];
}

// Map non-standard columns to their nearest standard board column
// e.g. 'report' cards sit in the board's 'invoice' column visually,
// 'asset_eval' sits in the 'evaluation' column
export function mapToBoardColumn(phase) {
    const mapping = {
        report: 'invoice',       // Minor's "Laporan" shows in the Invoice column slot
        asset_eval: 'evaluation', // Asset's "Evaluasi Aset" shows in the Evaluation column slot
    };
    return mapping[phase] || phase;
}

// Reverse: get the actual phase from a board column + procurement type
export function mapFromBoardColumn(boardColumn, procurementType) {
    const type = PROCUREMENT_TYPES[procurementType] || PROCUREMENT_TYPES.major;
    const flow = type.flow;

    // Direct match
    if (flow.includes(boardColumn)) return boardColumn;

    // Reverse mapping
    if (boardColumn === 'invoice' && flow.includes('report')) return 'report';
    if (boardColumn === 'evaluation' && flow.includes('asset_eval')) return 'asset_eval';

    return boardColumn;
}
