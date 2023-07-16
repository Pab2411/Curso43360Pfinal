import fs from "fs"

const path = "./messages.json"

export default class MessagesManager {
    getAllMessages = () => {
        if (fs.existsSync(path)) {
            const data = fs.readFileSync(path, "utf-8")
            return JSON.parse(data)
        } else {
            return []
        }
    }

    saveMessages = (user, message) => {
        const messages = this.getAllMessages()

        if (!user || !message) return ({ status: "error", error: "Faltan datos" })

        messages.push({ user, message })

        fs.writeFileSync(path, JSON.stringify(messages))
    }
}