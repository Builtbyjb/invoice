import { useMemo, useRef, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';

import { Text } from '@/components/Text';
import { radii, useTheme } from '@/constants/theme';
import { fitTransform, IDENTITY, strokesBounds, strokeToPath, type Transform } from '@/lib/signature';
import type { Point, Stroke } from '@/schemas/invoice';

type Props = {
  strokes: Stroke[];
  onChange?: (strokes: Stroke[]) => void;
  readOnly?: boolean;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  /** Called with true while a stroke is being drawn, so a parent ScrollView can disable scrolling. */
  onDrawingChange?: (drawing: boolean) => void;
  testID?: string;
};

/** Port of SignatureCanvas. Points are stored in the canvas' local coordinate space. */
export function SignatureCanvas({
  strokes,
  onChange,
  readOnly = false,
  height = 160,
  strokeColor,
  strokeWidth = 2.5,
  onDrawingChange,
  testID,
}: Props) {
  const { colors } = useTheme();
  const color = strokeColor ?? colors.label;
  // Points are accumulated in a ref (gesture handlers) and mirrored into state for rendering.
  const pointsRef = useRef<Point[]>([]);
  const [current, setCurrent] = useState<Point[]>([]);
  const [width, setWidth] = useState(0);

  const finish = () => {
    const points = pointsRef.current;
    if (points.length > 0) {
      onChange?.([...strokes, { points }]);
    }
    pointsRef.current = [];
    setCurrent([]);
    onDrawingChange?.(false);
  };

  // The callbacks below only run from gesture events (never during render), so reading the ref is safe.
  /* eslint-disable react-hooks/refs */
  const pan = Gesture.Pan()
    .enabled(!readOnly)
    .minDistance(0)
    .runOnJS(true)
    .onBegin((e) => {
      pointsRef.current = [{ x: e.x, y: e.y }];
      setCurrent(pointsRef.current);
      onDrawingChange?.(true);
    })
    .onUpdate((e) => {
      pointsRef.current = [...pointsRef.current, { x: e.x, y: e.y }];
      setCurrent(pointsRef.current);
    })
    .onFinalize(finish);
  /* eslint-enable react-hooks/refs */

  // Read-only: scale to fit so signatures drawn on a larger canvas aren't clipped (rewrite plan §6 #14).
  const transform: Transform = useMemo(() => {
    if (!readOnly || width === 0) return IDENTITY;
    const bounds = strokesBounds(strokes);
    if (!bounds) return IDENTITY;
    const t = fitTransform(bounds, width, height, 10);
    // Don't enlarge small signatures beyond their natural size.
    if (t.scale > 1) {
      const dx = bounds.maxX - bounds.minX;
      const dy = bounds.maxY - bounds.minY;
      return { scale: 1, offsetX: (width - dx) / 2 - bounds.minX, offsetY: (height - dy) / 2 - bounds.minY };
    }
    return t;
  }, [readOnly, width, height, strokes]);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  const pathProps = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  const empty = strokes.length === 0 && current.length === 0;

  return (
    <GestureDetector gesture={pan}>
      <View
        testID={testID}
        onLayout={onLayout}
        accessibilityLabel={readOnly ? 'Signature' : 'Signature pad'}
        style={{
          height,
          width: '100%',
          borderRadius: radii.inner,
          backgroundColor: colors.fill,
          borderWidth: 1,
          borderColor: colors.separator,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Svg width="100%" height="100%" style={{ position: 'absolute', left: 0, top: 0 }}>
          {strokes.map((s, i) => (
            <Path key={i} d={strokeToPath(s.points, transform)} {...pathProps} />
          ))}
          {current.length > 0 ? <Path d={strokeToPath(current)} {...pathProps} /> : null}
        </Svg>
        {empty && !readOnly ? (
          <Text variant="subheadline" secondary pointerEvents="none">
            Sign here
          </Text>
        ) : null}
      </View>
    </GestureDetector>
  );
}
