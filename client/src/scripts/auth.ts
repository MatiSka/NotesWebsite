import CryptoJS from "crypto-js"

export function Encrypt(key: string, data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString()
}

export function Decrypt(key: string, data: string): any {
    try {
        const bytes = CryptoJS.AES.decrypt(data, key)

        if (bytes.sigBytes <= 0) {return}

        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    } catch (err) {
        throw new Error("Decryption failed")
    }
}