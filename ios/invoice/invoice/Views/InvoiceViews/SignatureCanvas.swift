//
//  SignatureCanvas.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import SwiftUI

struct SignatureCanvas: View {
    @Binding var strokes: [Stroke]
    let readOnly: Bool
    let strokeColor: Color
    let strokeWidth: CGFloat
    let canvasHeight: CGFloat
    
    init(
        strokes: Binding<[Stroke]>,
        readOnly: Bool = false,
        strokeColor: Color = .primary,
        strokeWidth: CGFloat = 2.5,
        canvasHeight: CGFloat = 160
    ) {
        self._strokes = strokes
        self.readOnly = readOnly
        self.strokeColor = strokeColor
        self.strokeWidth = strokeWidth
        self.canvasHeight = canvasHeight
    }
    
    @State private var currentStrokePoints: [CGPoint] = []
    
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color(.systemGray4), lineWidth: 1)
                .background(Color(.systemGray6))
                .cornerRadius(12)
            
            Canvas { context, size in
                for stroke in strokes {
                    var path = Path()
                    let points = stroke.points.map { $0.point }
                    guard let first = points.first else { continue }
                    path.move(to: first)
                    for point in points.dropFirst() {
                        path.addLine(to: point)
                    }
                    context.stroke(path, with: .color(strokeColor), lineWidth: strokeWidth)
                }
                
                if !currentStrokePoints.isEmpty {
                    var path = Path()
                    path.move(to: currentStrokePoints[0])
                    for point in currentStrokePoints.dropFirst() {
                        path.addLine(to: point)
                    }
                    context.stroke(path, with: .color(strokeColor), lineWidth: strokeWidth)
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .contentShape(Rectangle())
            .allowsHitTesting(!readOnly)
            .gesture(
                DragGesture(minimumDistance: 0, coordinateSpace: .local)
                    .onChanged { value in
                        guard !readOnly else { return }
                        if currentStrokePoints.isEmpty {
                            currentStrokePoints.append(value.location)
                        } else {
                            currentStrokePoints.append(value.location)
                        }
                    }
                    .onEnded { _ in
                        guard !readOnly else { return }
                        let wrapped = currentStrokePoints.map { CGPointWrapper($0) }
                        strokes.append(Stroke(points: wrapped))
                        currentStrokePoints = []
                    }
            )
            
            if strokes.isEmpty && currentStrokePoints.isEmpty && !readOnly {
                Text("Sign here")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
        }
        .frame(height: canvasHeight)
    }
}

#Preview {
    @Previewable @State var strokes: [Stroke] = []
    VStack(spacing: 16) {
        Text("Interactive Canvas")
            .font(.headline)
        SignatureCanvas(strokes: $strokes, readOnly: false)
        
        if !strokes.isEmpty {
            Text("Read-Only Preview")
                .font(.headline)
            SignatureCanvas(strokes: .constant(strokes), readOnly: true)
        }
    }
    .padding()
}
