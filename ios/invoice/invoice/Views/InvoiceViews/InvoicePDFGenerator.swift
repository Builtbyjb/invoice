//
//  InvoicePDFGenerator.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import UIKit

struct InvoicePDFGenerator {
    static let a4Width: CGFloat = 612
    static let a4Height: CGFloat = 792
    static let margin: CGFloat = 50
    
    static func generatePDF(for invoice: Invoice) -> Data? {
        let format = UIGraphicsPDFRendererFormat()
        let renderer = UIGraphicsPDFRenderer(bounds: CGRect(x: 0, y: 0, width: a4Width, height: a4Height), format: format)
        
        let data = renderer.pdfData { context in
            context.beginPage()
            var cursorY: CGFloat = margin
            
            cursorY = drawHeader(context: context, invoice: invoice, startY: cursorY)
            cursorY += 20
            
            cursorY = drawMetaInfo(context: context, invoice: invoice, startY: cursorY)
            cursorY += 20
            
            cursorY = drawClientInfo(context: context, invoice: invoice, startY: cursorY)
            cursorY += 20
            
            cursorY = drawLineItems(context: context, invoice: invoice, startY: cursorY)
            cursorY += 20
            
            cursorY = drawSummary(context: context, invoice: invoice, startY: cursorY)
            cursorY += 20
            
            if !invoice.notes.isEmpty {
                cursorY = drawNotes(context: context, invoice: invoice, startY: cursorY)
                cursorY += 20
            }
            
            if !invoice.signatureStrokes.isEmpty {
                _ = drawSignature(context: context, invoice: invoice, startY: cursorY)
            }
        }
        
        return data
    }
    
    // MARK: - Header
    
    private static func drawHeader(context: UIGraphicsPDFRendererContext, invoice: Invoice, startY: CGFloat) -> CGFloat {
        let logoSize: CGFloat = 48
        let logoRect = CGRect(x: margin, y: startY, width: logoSize, height: logoSize)
        
        // Draw logo placeholder
        let logoPath = UIBezierPath(roundedRect: logoRect, cornerRadius: 8)
        UIColor.systemGray5.setFill()
        logoPath.fill()
        UIColor.systemGray3.setStroke()
        logoPath.stroke()
        
        let logoText = "LOGO"
        let logoFont = UIFont.systemFont(ofSize: 10, weight: .bold)
        let logoTextSize = logoText.size(withAttributes: [.font: logoFont])
        let logoTextPoint = CGPoint(
            x: logoRect.midX - logoTextSize.width / 2,
            y: logoRect.midY - logoTextSize.height / 2
        )
        logoText.draw(at: logoTextPoint, withAttributes: [
            .font: logoFont,
            .foregroundColor: UIColor.systemGray
        ])
        
        // Business name
        let businessName = "Your Business Name"
        let businessFont = UIFont.systemFont(ofSize: 20, weight: .bold)
        businessName.draw(at: CGPoint(x: margin + logoSize + 12, y: startY + 4), withAttributes: [
            .font: businessFont,
            .foregroundColor: UIColor.label
        ])
        
        // Invoice label
        let invoiceLabel = "INVOICE"
        let invoiceLabelFont = UIFont.systemFont(ofSize: 28, weight: .heavy)
        let invoiceLabelSize = invoiceLabel.size(withAttributes: [.font: invoiceLabelFont])
        invoiceLabel.draw(at: CGPoint(
            x: a4Width - margin - invoiceLabelSize.width,
            y: startY
        ), withAttributes: [
            .font: invoiceLabelFont,
            .foregroundColor: UIColor.systemBlue
        ])
        
        let invoiceNumber = invoice.formattedInvoiceNumber
        let invoiceNumberFont = UIFont.systemFont(ofSize: 12, weight: .medium)
        let invoiceNumberSize = invoiceNumber.size(withAttributes: [.font: invoiceNumberFont])
        invoiceNumber.draw(at: CGPoint(
            x: a4Width - margin - invoiceNumberSize.width,
            y: startY + invoiceLabelSize.height + 4
        ), withAttributes: [
            .font: invoiceNumberFont,
            .foregroundColor: UIColor.secondaryLabel
        ])
        
        return startY + max(logoSize, invoiceLabelSize.height + invoiceNumberSize.height + 4)
    }
    
    // MARK: - Meta Info
    
    private static func drawMetaInfo(context: UIGraphicsPDFRendererContext, invoice: Invoice, startY: CGFloat) -> CGFloat {
        let colWidth = (a4Width - margin * 2) / 3
        let dateFormatter = DateFormatter()
        dateFormatter.dateStyle = .medium
        
        let metaItems: [(String, String)] = [
            ("Status", invoice.status.rawValue),
            ("Issue Date", dateFormatter.string(from: invoice.issueDate)),
            ("Due Date", dateFormatter.string(from: invoice.dueDate))
        ]
        
        var maxHeight: CGFloat = 0
        
        for (index, item) in metaItems.enumerated() {
            let x = margin + CGFloat(index) * colWidth
            let titleFont = UIFont.systemFont(ofSize: 10, weight: .semibold)
            let valueFont = UIFont.systemFont(ofSize: 12, weight: .medium)
            
            let titleSize = item.0.size(withAttributes: [.font: titleFont])
            item.0.draw(at: CGPoint(x: x, y: startY), withAttributes: [
                .font: titleFont,
                .foregroundColor: UIColor.secondaryLabel
            ])
            
            item.1.draw(at: CGPoint(x: x, y: startY + titleSize.height + 2), withAttributes: [
                .font: valueFont,
                .foregroundColor: UIColor.label
            ])
            
            let totalHeight = titleSize.height + 2 + valueFont.lineHeight
            maxHeight = max(maxHeight, totalHeight)
        }
        
        return startY + maxHeight + 8
    }
    
    // MARK: - Client Info
    
    private static func drawClientInfo(context: UIGraphicsPDFRendererContext, invoice: Invoice, startY: CGFloat) -> CGFloat {
        let title = "Billed To"
        let titleFont = UIFont.systemFont(ofSize: 10, weight: .semibold)
        title.draw(at: CGPoint(x: margin, y: startY), withAttributes: [
            .font: titleFont,
            .foregroundColor: UIColor.secondaryLabel
        ])
        
        let bodyFont = UIFont.systemFont(ofSize: 12, weight: .regular)
        let boldFont = UIFont.systemFont(ofSize: 13, weight: .bold)
        
        let client = invoice.client
        var lines: [(String, UIFont)] = [
            (client.name, boldFont),
            (client.email, bodyFont),
            (client.phone, bodyFont),
            ("\(client.address), \(client.city), \(client.country)", bodyFont)
        ]
        
        var cursorY = startY + titleFont.lineHeight + 4
        for (text, font) in lines {
            text.draw(at: CGPoint(x: margin, y: cursorY), withAttributes: [
                .font: font,
                .foregroundColor: UIColor.label
            ])
            cursorY += font.lineHeight + 2
        }
        
        return cursorY
    }
    
    // MARK: - Line Items
    
    private static func drawLineItems(context: UIGraphicsPDFRendererContext, invoice: Invoice, startY: CGFloat) -> CGFloat {
        let tableX = margin
        let tableWidth = a4Width - margin * 2
        let rowHeight: CGFloat = 28
        let headerHeight: CGFloat = 32
        
        let colWidths: [CGFloat] = [
            tableWidth * 0.45,
            tableWidth * 0.15,
            tableWidth * 0.12,
            tableWidth * 0.14,
            tableWidth * 0.14
        ]
        
        let headers = ["Description", "Qty", "Unit", "Price", "Total"]
        
        // Header background
        let headerRect = CGRect(x: tableX, y: startY, width: tableWidth, height: headerHeight)
        UIColor.systemGray6.setFill()
        UIBezierPath(rect: headerRect).fill()
        
        // Header text
        let headerFont = UIFont.systemFont(ofSize: 11, weight: .semibold)
        var colX = tableX
        for (index, header) in headers.enumerated() {
            header.draw(at: CGPoint(x: colX + 6, y: startY + (headerHeight - headerFont.lineHeight) / 2), withAttributes: [
                .font: headerFont,
                .foregroundColor: UIColor.secondaryLabel
            ])
            colX += colWidths[index]
        }
        
        var cursorY = startY + headerHeight
        let bodyFont = UIFont.systemFont(ofSize: 11, weight: .regular)
        let numberAttributes: [NSAttributedString.Key: Any] = [
            .font: bodyFont,
            .foregroundColor: UIColor.label,
            .paragraphStyle: {
                let style = NSMutableParagraphStyle()
                style.alignment = .right
                return style
            }()
        ]
        
        let currencyFormatter = NumberFormatter()
        currencyFormatter.numberStyle = .currency
        currencyFormatter.currencyCode = "USD"
        
        for item in invoice.lineItems {
            let rowRect = CGRect(x: tableX, y: cursorY, width: tableWidth, height: rowHeight)
            
            // Alternate row background
            if invoice.lineItems.firstIndex(where: { $0.id == item.id })?.isMultiple(of: 2) == false {
                UIColor.systemGray6.withAlphaComponent(0.3).setFill()
                UIBezierPath(rect: rowRect).fill()
            }
            
            // Bottom border
            let linePath = UIBezierPath()
            linePath.move(to: CGPoint(x: tableX, y: cursorY + rowHeight))
            linePath.addLine(to: CGPoint(x: tableX + tableWidth, y: cursorY + rowHeight))
            UIColor.systemGray4.setStroke()
            linePath.stroke()
            
            let textY = cursorY + (rowHeight - bodyFont.lineHeight) / 2
            
            item.description.draw(at: CGPoint(x: tableX + 6, y: textY), withAttributes: [
                .font: bodyFont,
                .foregroundColor: UIColor.label
            ])
            
            let qtyRect = CGRect(x: tableX + colWidths[0], y: textY, width: colWidths[1] - 6, height: rowHeight)
            String(format: "%.1f", item.quantity).draw(in: qtyRect, withAttributes: numberAttributes)
            
            let unitRect = CGRect(x: tableX + colWidths[0] + colWidths[1], y: textY, width: colWidths[2] - 6, height: rowHeight)
            item.unit.draw(in: unitRect, withAttributes: numberAttributes)
            
            let priceRect = CGRect(x: tableX + colWidths[0] + colWidths[1] + colWidths[2], y: textY, width: colWidths[3] - 6, height: rowHeight)
            (currencyFormatter.string(from: NSNumber(value: item.price)) ?? "\(item.price)").draw(in: priceRect, withAttributes: numberAttributes)
            
            let totalRect = CGRect(x: tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y: textY, width: colWidths[4] - 6, height: rowHeight)
            (currencyFormatter.string(from: NSNumber(value: item.total)) ?? "\(item.total)").draw(in: totalRect, withAttributes: numberAttributes)
            
            cursorY += rowHeight
        }
        
        return cursorY
    }
    
    // MARK: - Summary
    
    private static func drawSummary(context: UIGraphicsPDFRendererContext, invoice: Invoice, startY: CGFloat) -> CGFloat {
        let labelX = a4Width - margin - 200
        let valueX = a4Width - margin - 80
        let lineHeight: CGFloat = 20
        let font = UIFont.systemFont(ofSize: 11, weight: .regular)
        let boldFont = UIFont.systemFont(ofSize: 12, weight: .bold)
        
        let currencyFormatter = NumberFormatter()
        currencyFormatter.numberStyle = .currency
        currencyFormatter.currencyCode = "USD"
        
        var cursorY = startY
        
        let summaryItems: [(String, Double, UIFont)] = [
            ("Subtotal", invoice.subtotal, font),
            ("Discount (\(String(format: "%.1f", invoice.discountPercent))%)", invoice.discountAmount, font),
            ("Tax (\(String(format: "%.1f", invoice.taxPercent))%)", invoice.taxAmount, font),
            ("Grand Total", invoice.grandTotal, boldFont)
        ]
        
        for (label, value, valueFont) in summaryItems {
            label.draw(at: CGPoint(x: labelX, y: cursorY), withAttributes: [
                .font: font,
                .foregroundColor: UIColor.secondaryLabel
            ])
            
            let valueString = currencyFormatter.string(from: NSNumber(value: value)) ?? "\(value)"
            let valueSize = valueString.size(withAttributes: [.font: valueFont])
            valueString.draw(at: CGPoint(x: valueX + 80 - valueSize.width, y: cursorY), withAttributes: [
                .font: valueFont,
                .foregroundColor: UIColor.label
            ])
            
            cursorY += lineHeight
        }
        
        // Grand total separator line
        let totalLineY = cursorY - lineHeight - 4
        let linePath = UIBezierPath()
        linePath.move(to: CGPoint(x: labelX, y: totalLineY))
        linePath.addLine(to: CGPoint(x: a4Width - margin, y: totalLineY))
        UIColor.label.setStroke()
        linePath.lineWidth = 1.5
        linePath.stroke()
        
        return cursorY
    }
    
    // MARK: - Notes
    
    private static func drawNotes(context: UIGraphicsPDFRendererContext, invoice: Invoice, startY: CGFloat) -> CGFloat {
        let title = "Notes"
        let titleFont = UIFont.systemFont(ofSize: 10, weight: .semibold)
        title.draw(at: CGPoint(x: margin, y: startY), withAttributes: [
            .font: titleFont,
            .foregroundColor: UIColor.secondaryLabel
        ])
        
        let bodyFont = UIFont.systemFont(ofSize: 11, weight: .regular)
        let textRect = CGRect(x: margin, y: startY + titleFont.lineHeight + 4, width: a4Width - margin * 2, height: 60)
        invoice.notes.draw(in: textRect, withAttributes: [
            .font: bodyFont,
            .foregroundColor: UIColor.label
        ])
        
        return startY + titleFont.lineHeight + 4 + 60
    }
    
    // MARK: - Signature
    
    private static func drawSignature(context: UIGraphicsPDFRendererContext, invoice: Invoice, startY: CGFloat) -> CGFloat {
        let title = "Signature"
        let titleFont = UIFont.systemFont(ofSize: 10, weight: .semibold)
        title.draw(at: CGPoint(x: margin, y: startY), withAttributes: [
            .font: titleFont,
            .foregroundColor: UIColor.secondaryLabel
        ])
        
        let boxRect = CGRect(x: margin, y: startY + titleFont.lineHeight + 4, width: 200, height: 80)
        let boxPath = UIBezierPath(rect: boxRect)
        UIColor.systemGray5.setFill()
        boxPath.fill()
        UIColor.systemGray3.setStroke()
        boxPath.stroke()
        
        // Normalize strokes to fit box
        let allPoints = invoice.signatureStrokes.flatMap { $0.points.map { $0.point } }
        guard !allPoints.isEmpty else { return startY + titleFont.lineHeight + 4 + 80 }
        
        let minX = allPoints.map { $0.x }.min() ?? 0
        let maxX = allPoints.map { $0.x }.max() ?? 1
        let minY = allPoints.map { $0.y }.min() ?? 0
        let maxY = allPoints.map { $0.y }.max() ?? 1
        
        let scaleX = (boxRect.width - 20) / max(maxX - minX, 1)
        let scaleY = (boxRect.height - 20) / max(maxY - minY, 1)
        let scale = min(scaleX, scaleY)
        
        let offsetX = boxRect.minX + 10 + (boxRect.width - 20 - (maxX - minX) * scale) / 2
        let offsetY = boxRect.minY + 10 + (boxRect.height - 20 - (maxY - minY) * scale) / 2
        
        for stroke in invoice.signatureStrokes {
            let points = stroke.points.map { $0.point }
            guard let first = points.first else { continue }
            
            let path = UIBezierPath()
            path.move(to: CGPoint(
                x: offsetX + (first.x - minX) * scale,
                y: offsetY + (first.y - minY) * scale
            ))
            
            for point in points.dropFirst() {
                path.addLine(to: CGPoint(
                    x: offsetX + (point.x - minX) * scale,
                    y: offsetY + (point.y - minY) * scale
                ))
            }
            
            UIColor.label.setStroke()
            path.lineWidth = 1.5
            path.lineCapStyle = .round
            path.stroke()
        }
        
        return startY + titleFont.lineHeight + 4 + 80
    }
}
