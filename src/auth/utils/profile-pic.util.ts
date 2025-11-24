export function randomProfilePic() {

    const pics: string[] = [
        "https://api.dicebear.com/7.x/identicon/png?seed=github1&backgroundColor=004500",
        "https://api.dicebear.com/7.x/identicon/png?seed=bot2&backgroundColor=44a0ed",
        "https://api.dicebear.com/7.x/identicon/png?seed=github3&backgroundColor=46d160",
        "https://api.dicebear.com/7.x/identicon/png?seed=github3&backgroundColor=0f585b",
        "https://api.dicebear.com/7.x/identicon/png?seed=github4&backgroundColor=ffb000",
        "https://api.dicebear.com/7.x/identicon/png?seed=github6&backgroundColor=7e53c1",
        "https://api.dicebear.com/7.x/identicon/png?seed=reddit7&backgroundColor=00a6a6",
        "https://api.dicebear.com/7.x/identicon/png?seed=reddit8&backgroundColor=ff66ac",
        "https://api.dicebear.com/7.x/identicon/png?seed=reddit10&backgroundColor=ff8c42"]

    return pics[Math.floor(Math.random() * pics.length)]
}