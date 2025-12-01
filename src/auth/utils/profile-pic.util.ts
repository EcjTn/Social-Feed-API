export function generateIdenticon(username: string) {
    const avatar = `https://api.dicebear.com/9.x/identicon/svg?seed=${username}&backgroundType=solid,gradientLinear&backgroundColor=c0aede,d1d4f9,ffdfbf,b6e3f4`
    return avatar
}
