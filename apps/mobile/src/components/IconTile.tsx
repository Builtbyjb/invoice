import { View } from 'react-native';

import type { SFName } from '../constants/icons';
import { radii, withAlpha } from '../constants/theme';

import { Icon } from './Icon';

type Props = { sf: SFName; color: string; iconSize?: number };

export function IconTile({ sf, color, iconSize = 22 }: Props) {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: radii.tile,
        backgroundColor: withAlpha(color, 0.15),
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon sf={sf} size={iconSize} color={color} />
    </View>
  );
}
