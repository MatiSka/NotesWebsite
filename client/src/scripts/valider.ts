export function ValidateEmail(email: string): boolean {
    if (email.length == 0){return false}

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return regex.test(email)
}

export function GetInitials(name: string): string {
    if (!name){return ""}

    const nameSplit = name.split(" ")
    let initials    = ""

    for (let i=0; i < Math.min(nameSplit.length, 2); i++){
        initials += nameSplit[i][0]
    }

    return initials.toUpperCase()
}

export function GetCurrentTime(dateStr: string): string {
    const datePart = dateStr.slice(0, 10).replace(/-/g, '/');
    const timePart = dateStr.slice(11, 16);               

    return `${datePart} | ${timePart}`;
}