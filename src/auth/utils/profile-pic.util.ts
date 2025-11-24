import { createAvatar } from '@dicebear/core';
import { identicon } from '@dicebear/collection';

export function generateIdenticon(username: string) {
    const avatar = createAvatar(identicon, {
        seed: username,
        backgroundType: ['gradientLinear'],
        backgroundRotation: [0, 360, 50],
        randomizeIds: true,
        backgroundColor: ['ffdfbf', 'ffd5dc', 'd1d4f9', 'c0aede', 'b6e3f4']
    });

    return avatar.toString();
}
