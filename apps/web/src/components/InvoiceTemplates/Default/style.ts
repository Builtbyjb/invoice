import { StyleSheet, Font } from "@react-pdf/renderer";

import NotoSansRegular from "@/fonts/NotoSans/NotoSans-Regular.ttf";
import NotoSansItalic from "@/fonts/NotoSans/NotoSans-Italic.ttf";
import NotoSansBold from "@/fonts/NotoSans/NotoSans-Bold.ttf";
import NotoSansBoldItalic from "@/fonts/NotoSans/NotoSans-BoldItalic.ttf";

const FONT_FAMILY = "Noto Sans";
Font.register({
    family: "Noto Sans",
    fonts: [
        { src: NotoSansRegular, fontWeight: 400 },
        { src: NotoSansItalic, fontWeight: 400, fontStyle: "italic" },
        { src: NotoSansBold, fontWeight: 700 },
        { src: NotoSansBoldItalic, fontWeight: 700, fontStyle: "italic" },
    ],
});

const COLORS = {
    white: "#ffffff",
    gray900: "#111827",
    gray600: "#4b5563",
    gray500: "#6b7280",
    gray100: "#f3f4f6",
    gray50: "#f9fafb",
    border: "#e5e7eb",
};

export const STYLE = StyleSheet.create({
    page: {
        fontFamily: FONT_FAMILY,
        fontSize: 10,
        color: COLORS.gray900,
        backgroundColor: COLORS.white,
        paddingTop: 28,
        paddingBottom: 28,
        paddingHorizontal: 28,
    },

    column: { flexDirection: "column" },
    row: { flexDirection: "row" },
    spaceBetween: { flexDirection: "row", justifyContent: "space-between" },
    flex1: { flex: 1 },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: 16,
        marginBottom: 16,
    },

    logo: { width: 48, height: 48, borderRadius: 24, objectFit: "contain", marginBottom: 6 },
    businessName: { fontSize: 16, fontFamily: FONT_FAMILY },
    invoiceNumber: { fontSize: 12, fontFamily: FONT_FAMILY, textAlign: "right" },
    headerMeta: { fontSize: 9, color: COLORS.gray600, textAlign: "right", marginTop: 2 },

    billToBox: {
        backgroundColor: COLORS.gray50,
        borderRadius: 8,
        padding: 14,
        marginBottom: 16,
    },

    sectionLabel: {
        fontSize: 8,
        fontFamily: FONT_FAMILY,
        textTransform: "uppercase",
        color: COLORS.gray500,
        letterSpacing: 0.6,
        marginBottom: 6,
    },
    clientName: { fontSize: 11, fontFamily: FONT_FAMILY, marginBottom: 2 },
    clientMeta: { fontSize: 9, color: COLORS.gray600, marginBottom: 1 },

    // ---- Table ----
    tableHeader: {
        flexDirection: "row",
        backgroundColor: COLORS.gray100,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
    },
    tableHeaderText: {
        fontSize: 9,
        fontFamily: FONT_FAMILY,
        color: COLORS.gray600,
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    tableRowText: { fontSize: 9, fontFamily: FONT_FAMILY, color: COLORS.gray900 },

    // Column widths (must sum to ~100%)
    colDesc: { flex: 2.4 },
    colQty: { flex: 0.8, textAlign: "center" },
    colUnit: { flex: 1, textAlign: "right" },
    colAmount: { flex: 1, textAlign: "right" },

    // ---- Totals ----
    totalsWrapper: { alignItems: "flex-end", marginTop: 10 },
    totalsBox: { width: 200 },
    totalsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    totalsLabel: { fontSize: 9, color: COLORS.gray600 },
    totalsValue: { fontSize: 9, color: COLORS.gray900 },
    totalsFinalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 6,
        marginTop: 4,
    },
    totalsFinalLabel: { fontSize: 12, fontFamily: FONT_FAMILY },
    totalsFinalValue: { fontSize: 12, fontFamily: FONT_FAMILY },

    notesWrapper: { marginTop: 14 },
    notesText: { fontSize: 9, color: COLORS.gray600 },

    // ---- Signatures ----
    signaturesWrapper: { marginTop: "auto", paddingTop: 10 },

    signaturesGrid: {
        flexDirection: "row",
        gap: 40,
        marginBottom: 20,
    },
    signatureBlock: { flex: 1, alignItems: "center" },
    signatureImage: { width: "100%", height: 48, objectFit: "contain" },
    signatureLine: {
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 5,
        marginTop: 6,
        width: "100%",
        textAlign: "center",
        fontSize: 9,
        color: COLORS.gray900,
    },

    // ---- Footer ----
    footer: {
        textAlign: "center",
        fontSize: 8,
        color: COLORS.gray600,
        marginTop: 10,
        fontStyle: "italic",
    },
});
